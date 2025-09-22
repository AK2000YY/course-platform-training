"use server";

import z from "zod";
import { lessonSchema } from "../schema/lesson";
import {
  canCreateLessons,
  canDeleteLessons,
  canUpdateLessons,
} from "../permisson/lesson";
import { getCurrentUser } from "@/services/clerk";
import {
  getNextLessonOrder,
  insertLesson,
  updateLesson as dbUpdateLesson,
  deleteLesson as dbDeleteLesson,
  updateLessonOrders as dbUpdateLessonOrders,
} from "../db/lesson";

export async function createLesson(unsafeData: z.infer<typeof lessonSchema>) {
  const { success, data } = lessonSchema.safeParse(unsafeData);

  if (!success || !canCreateLessons(await getCurrentUser()))
    return {
      error: true,
      message: "Error create your lesson",
    };

  const order = await getNextLessonOrder(data.courseSectionId);

  await insertLesson({ ...data, order });

  return {
    error: false,
    message: "Successfully create your lesson",
  };
}

export async function updateLesson(
  id: string,
  unsafeData: z.infer<typeof lessonSchema>
) {
  const { success, data } = lessonSchema.safeParse(unsafeData);

  if (!success || !canUpdateLessons(await getCurrentUser()))
    return {
      error: true,
      message: "Error updating your lesson",
    };

  await dbUpdateLesson(id, data);

  return {
    error: false,
    message: "Successfully updating your lesson",
  };
}

export async function deleteLesson(id: string) {
  if (!canDeleteLessons(await getCurrentUser()))
    return {
      error: true,
      message: "Error deleting your lesson",
    };
  await dbDeleteLesson(id);

  return {
    error: false,
    message: "Successfully deleting your lesson",
  };
}

export async function updateLessonOrders(lessonsId: string[]) {
  if (lessonsId.length == 0 || !canUpdateLessons(await getCurrentUser()))
    return {
      error: true,
      message: "Error reordering your lessons",
    };

  await dbUpdateLessonOrders(lessonsId);

  return {
    error: false,
    message: "Successfully reordering your lessons",
  };
}
