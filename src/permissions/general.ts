import { UserRole } from "@/drizzle/schema";

export function canAccessAdminPage(role: UserRole | undefined) {
  return role === "admin";
}
