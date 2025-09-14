"use server";

import z from "zod";
import { courseSchema } from "../schemas/coureses";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCourse, canDeleteCourse } from "../permissions/courses";
import { insertCourse, deleteCourse as dbDeleteCoures } from "../db/courses";

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unsafeData);

  if (!success || !canCreateCourse(await getCurrentUser())) {
    return {
      error: true,
      message: "There is an error creating course",
    };
  }

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
}

export async function deleteCourse(id: string) {
  if (!canDeleteCourse(await getCurrentUser()))
    return {
      error: true,
      message: "Error delete your course",
    };
  await dbDeleteCoures(id);
  return {
    error: false,
    message: "Successfuly delete your course",
  };
}
