export const ADMIN_EMAILS = [
  "admin@qcm.in",
  "admin@quizzersclub.in",
  "quizzersclub@gmail.com",
  "admin@qcm.com",
  "admin@admin.com"
];

/**
 * Check if the user has full administrative privileges.
 */
export function isAdminUser(user) {
  if (!user) return false;
  if (user.isAdmin === true) return true;
  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return true;
  if (user.name === "admin") return true;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) return true;
  return false;
}

/**
 * Check if the user is a club staff/organizer/coordinator with elevated dashboard access.
 */
export function isStaffUser(user) {
  if (!user) return false;
  if (isAdminUser(user)) return true;
  const role = String(user.role || "").toUpperCase();
  return ["ORGANIZER", "COORDINATOR", "MEMBER"].includes(role);
}
