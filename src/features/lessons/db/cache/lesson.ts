import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/dataCach";
import { revalidateTag } from "next/cache";

export function getLessonGlobalTag() {
  return getGlobalTag("lesson");
}

export function getLessonIdTag(id: string) {
  return getIdTag("lesson", id);
}

export function getLessonCourseTag(courseId: string) {
  return getCourseTag("lesson", courseId);
}

export function revalidateLessonCache(id: string, courseId: string) {
  revalidateTag(getLessonGlobalTag());
  revalidateTag(getLessonIdTag(id));
  revalidateTag(getLessonCourseTag(courseId));
}
