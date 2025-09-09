"use server";

import z from "zod";
import { courseSchema } from "../schemas/coureses";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import { canCreateCourse } from "../permissions/courses";
import { insertCourse } from "../db/courses";

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
