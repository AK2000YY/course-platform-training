import { db } from "@/drizzle/db";
import { CourseSectionTable, LessonTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { revalidateLessonCache } from "../db/cache/lesson";

export async function getNextLessonOrder(sectionId: string) {
  const lesson = await db.query.LessonTable.findFirst({
    columns: { order: true },
    where: eq(LessonTable.courseSectionId, sectionId),
    orderBy: desc(LessonTable.order),
  });

  return lesson ? lesson.order + 1 : 0;
}

export async function insertLesson(data: typeof LessonTable.$inferInsert) {
  const [newLesson, courseId] = await db.transaction(async (trx) => {
    const [[newLesson], section] = await Promise.all([
      trx.insert(LessonTable).values(data).returning(),
      trx.query.CourseSectionTable.findFirst({
        columns: { courseId: true },
        where: eq(CourseSectionTable.id, data.courseSectionId),
      }),
    ]);

    if (section == null) return trx.rollback();

    return [newLesson, section.courseId];
  });

  if (!newLesson) throw new Error("faild to create lesson");

  revalidateLessonCache(newLesson.id, courseId);

  return newLesson;
}

export async function updateLesson(
  id: string,
  data: Partial<typeof LessonTable.$inferInsert>
) {
  const [upadtedLesson, courseId] = await db.transaction(async (trx) => {
    const currentLesson = await trx.query.LessonTable.findFirst({
      columns: { courseSectionId: true },
      where: eq(LessonTable.id, id),
    });

    if (
      data.courseSectionId != null &&
      currentLesson?.courseSectionId != data.courseSectionId &&
      data.order == null
    ) {
      data.order = await getNextLessonOrder(data.courseSectionId);
    }

    const [updatedLesson] = await trx
      .update(LessonTable)
      .set(data)
      .where(eq(LessonTable.id, id))
      .returning();

    if (updatedLesson == null) {
      trx.rollback();
      throw new Error("failed to update lesson");
    }

    const section = await trx.query.CourseSectionTable.findFirst({
      columns: { courseId: true },
      where: eq(CourseSectionTable.id, updatedLesson.courseSectionId),
    });

    if (section == null) return trx.rollback();

    return [updatedLesson, section.courseId];
  });

  revalidateLessonCache(upadtedLesson.id, courseId);

  return upadtedLesson;
}

export async function deleteLesson(id: string) {
  const [deletedLesson, courseId] = await db.transaction(async (trx) => {
    const [deletedLesson] = await trx
      .delete(LessonTable)
      .where(eq(LessonTable.id, id))
      .returning();

    if (!deletedLesson) {
      trx.rollback();
      throw new Error("faild to delete lesson");
    }

    const section = await trx.query.CourseSectionTable.findFirst({
      columns: { courseId: true },
      where: eq(CourseSectionTable.id, deletedLesson.courseSectionId),
    });

    if (!section) {
      return trx.rollback();
    }

    return [deletedLesson, section.courseId];
  });

  revalidateLessonCache(deletedLesson.id, courseId);

  return deletedLesson;
}

export async function updateLessonOrders(lessonsId: string[]) {
  const [lessons, courseId] = await db.transaction(async (trx) => {
    const lessons = await Promise.all(
      lessonsId.map((lessonId, index) =>
        trx
          .update(LessonTable)
          .set({ order: index })
          .where(eq(LessonTable.id, lessonId))
          .returning({
            sectionId: LessonTable.courseSectionId,
            id: LessonTable.id,
          })
      )
    );

    const sectionId = lessons[0]?.[0]?.sectionId ?? null;
    if (!sectionId) return trx.rollback();

    const section = await trx.query.CourseSectionTable.findFirst({
      columns: { courseId: true },
      where: eq(CourseSectionTable.id, sectionId),
    });

    if (section == null) return trx.rollback();

    return [lessons, section.courseId];
  });

  lessons
    .flat()
    .forEach((lesson) => revalidateLessonCache(lesson.id, courseId));
}
