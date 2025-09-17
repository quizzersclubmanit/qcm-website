import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setData, login, logout } from "./redux/user.slice";

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
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");

    if (!token || !storedUser) return;

    const payload = safeDecodeJwt(token);
    const isValid = payload && payload.exp && payload.exp * 1000 > Date.now();

    if (isValid) {
      try {
        dispatch(setData(JSON.parse(storedUser)));
        dispatch(login());
      } catch (e) {
        // ignore parsing/dispatch errors
      }
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      try { dispatch(logout()); } catch {}
    }
  }, [dispatch]);

  return children;
}
