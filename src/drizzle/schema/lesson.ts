import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { CourseSectionTable } from "./courseSection";
import { relations } from "drizzle-orm";
import { UserLessonCompleteTable } from "./userLessonComplete";

export const lessonStatuses = ["public", "private", "preview"] as const;
export type LessonStatus = (typeof lessonStatuses)[number];
export const lessonStatusEnum = pgEnum("lesson_status", lessonStatuses);

export const LessonTable = pgTable("lessons", {
  id,
  name: text("name").notNull(),
  description: text("description"),
  youtubeVideoId: text("youtube_video_id").notNull(),
  order: integer("order").notNull(),
  status: lessonStatusEnum("status").notNull().default("private"),
  courseSectionId: uuid("course_section_id")
    .notNull()
    .references(() => CourseSectionTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const LessonRelationships = relations(LessonTable, ({ one, many }) => ({
  courseSection: one(CourseSectionTable, {
    fields: [LessonTable.courseSectionId],
    references: [CourseSectionTable.id],
  }),
  userLessonComplete: many(UserLessonCompleteTable),
}));
