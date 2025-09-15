import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/dataCach";
import { revalidateTag } from "next/cache";

export function getCourseSectionGlobalTag() {
  return getGlobalTag("courseSection");
}

export function getCouseSectionIdTag(id: string) {
  return getIdTag("courseSection", id);
}

export function getCourseSectionCourseTag(courseId: string) {
  return getCourseTag("courseSection", courseId);
}

export function revalidateCourseSectionCache(id: string, courseId: string) {
  revalidateTag(getCourseSectionGlobalTag());
  revalidateTag(getCouseSectionIdTag(id));
  revalidateTag(getCourseSectionCourseTag(courseId));
}
