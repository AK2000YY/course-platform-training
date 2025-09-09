import { getGlobalTag, getIdTag } from "@/lib/dataCach";
import { revalidateTag } from "next/cache";

export function getCourseGlobalTag() {
  return getGlobalTag("users");
}

export function getCourseIdTag(id: string) {
  return getIdTag("courses", id);
}

export function revalidateCourseCache(id: string) {
  revalidateTag(getCourseGlobalTag());
  revalidateTag(getCourseIdTag(id));
}
