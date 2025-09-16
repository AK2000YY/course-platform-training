import { db } from "@/drizzle/db";
import { CourseSectionTable } from "@/drizzle/schema";
import { revalidateCourseSectionCache } from "./cache";
import { desc, eq } from "drizzle-orm";

export async function getNextCousrseSectionOrder(courseId: string) {
  const section = await db.query.CourseSectionTable.findFirst({
    columns: { order: true },
    orderBy: desc(CourseSectionTable.order),
    where: eq(CourseSectionTable.courseId, courseId),
  });

  return section ? section.order + 1 : 0;
}

export async function insertSection(
  data: typeof CourseSectionTable.$inferInsert
) {
  const [newSection] = await db
    .insert(CourseSectionTable)
    .values(data)
    .returning();

  if (!newSection) throw new Error("faild to create section");

  revalidateCourseSectionCache(newSection.id, newSection.courseId);

  return newSection;
}

export async function updateSection(
  id: string,
  data: Partial<typeof CourseSectionTable.$inferInsert>
) {
  const [updatedSection] = await db
    .update(CourseSectionTable)
    .set(data)
    .where(eq(CourseSectionTable.id, id))
    .returning();

  if (!updatedSection) throw new Error("faild to update section");

  revalidateCourseSectionCache(id, updatedSection.courseId);

  return updatedSection;
}

export async function deleteSection(id: string) {
  const [deletedSection] = await db
    .delete(CourseSectionTable)
    .where(eq(CourseSectionTable.id, id))
    .returning();

  if (!deletedSection) throw new Error("fiald to delete section");

  revalidateCourseSectionCache(id, deletedSection.courseId);

  return deletedSection;
}
