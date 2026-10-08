// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setData, login, logout } from "./redux/user.slice";
// import authService from "./api/auth.service";

// function safeDecodeJwt(token) {
//   try {
//     const base64Url = token.split(".")[1];
//     if (!base64Url) return null;
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     return null;
//   }
// }

// export default function AppInitializer({ children }) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     log('AppInitializer: Checking for stored auth data...');
    
//     const token = localStorage.getItem("authToken") || localStorage.getItem("token");
//     const storedUser = localStorage.getItem("userData");
    
//     log('AppInitializer: Token exists:', !!token);
//     log('AppInitializer: User data exists:', !!storedUser);

//     // If no token, remain logged out and clear any stale user info
//     if (!token) {
//       log('AppInitializer: No token present, staying logged out');
//       try { localStorage.removeItem('userData'); } catch {}
//       dispatch(setData({}));
//       dispatch(logout());
//       return;
//     }

//     // Quick local validity check (expiry), but do NOT auto-login yet
//     const payload = safeDecodeJwt(token);
//     const isValid = payload && payload.exp && payload.exp * 1000 > Date.now();
//     log('AppInitializer: Token valid (local check):', isValid);

//     if (!isValid) {
//       log('AppInitializer: Token expired, clearing storage');
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("token");
//       localStorage.removeItem("userData");
//       dispatch(setData({}));
//       dispatch(logout());
//       return;
//     }

//     // Validate with backend before logging in
//     (async () => {
//       try {
//         const currentUser = await authService.getCurrentUser();
//         if (currentUser && currentUser._id) {
//           log('AppInitializer: Backend validated user. Logging in.');
//           // Persist latest user
//           try { localStorage.setItem('userData', JSON.stringify(currentUser)); } catch {}
//           dispatch(setData(currentUser));
//           dispatch(login());
//         } else {
//           log('AppInitializer: Backend returned null user. Staying logged out.');
//           localStorage.removeItem('userData');
//           dispatch(setData({}));
//           dispatch(logout());
//         }
//       } catch (err) {
//         log('AppInitializer: Backend validation failed. Staying logged out.', err?.message);
//         // If backend says not authenticated or no user, keep logged out and clear stale storage
//         localStorage.removeItem('userData');
//         dispatch(setData({}));
//         dispatch(logout());
//       }
//     })();
//   }, [dispatch]);

//   return children;
// }


import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setData, login, logout } from "./redux/user.slice";
import authService from "./api/auth.service";
import { log, error as logError } from "./utils/log.js";

function safeDecodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    log('AppInitializer: Hydrating auth state from localStorage...');
    
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");
    
    log('AppInitializer: Token exists:', !!token);
    log('AppInitializer: User data exists:', !!storedUser);

    // If no token or user data, stay logged out
    if (!token || !storedUser) {
      log('AppInitializer: No token or user data, staying logged out');
      // Clear any stale data
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      dispatch(logout());
      return;
    }

    try {
      // Parse stored user data
      const userData = JSON.parse(storedUser);
      
      // Check token expiry
      const payload = safeDecodeJwt(token);
      const isTokenValid = payload && payload.exp && payload.exp * 1000 > Date.now();
      
      log('AppInitializer: Token valid:', isTokenValid);
      log('AppInitializer: User data:', userData);

      if (!isTokenValid) {
        log('AppInitializer: Token expired, clearing storage');
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        dispatch(logout());
        return;
      }

      // IMMEDIATELY hydrate Redux state
      log('AppInitializer: Hydrating Redux with stored user data');
      dispatch(setData(userData));
      dispatch(login());

      // Background validation with backend (optional - doesn't block UI)
      authService.getCurrentUser()
        .then((currentUser) => {
          if (currentUser && currentUser.id) {
            log('AppInitializer: Backend validation successful, updating user data');
            // Update with fresh data from backend
            localStorage.setItem('userData', JSON.stringify(currentUser));
            dispatch(setData(currentUser));
          } else {
            log('AppInitializer: Backend validation failed, logging out');
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            dispatch(logout());
          }
        })
        .catch((err) => {
          log('AppInitializer: Backend validation error:', err?.message);
          // Only logout if it's a 401/403 (authentication error)
          if (err?.message?.includes('401') || err?.message?.includes('Not authenticated')) {
            log('AppInitializer: Authentication error, logging out');
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
            dispatch(logout());
          }
          // For network errors, keep user logged in with cached data
        });

    } catch (error) {
      logError('AppInitializer: Error parsing stored user data:', error);
      // Clear corrupted data
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      dispatch(logout());
    }
  }, [dispatch]);

  return children;
}

