import { getGlobalTag, getIdTag } from "@/lib/dataCach";
import { revalidateTag } from "next/cache";

export function getUserGlobalUser() {
  return getGlobalTag("users");
}

export function getUserIdTag(id: string) {
  return getIdTag("users", id);
}

export function revalidateUserCache(id: string) {
  revalidateTag(getUserGlobalUser());
  revalidateTag(getUserIdTag(id));
}
