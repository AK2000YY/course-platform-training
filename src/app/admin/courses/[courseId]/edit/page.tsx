import PageHeader from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable } from "@/drizzle/schema";
import { getCourseIdTag } from "@/features/courses/db/cache/courses";
import { getCourseSectionCourseTag } from "@/features/courseSections/db/cache";
import { getLessonCourseTag } from "@/features/lessons/db/cache/lesson";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  console.log("id", courseId);
  const course = await getCourse(courseId);

  if (!course) return notFound();

  return (
    <div className="container my-6 mx-auto">
      <PageHeader title={course.name} />
    </div>
  );
}

const getCourse = (id: string) =>
  unstable_cache(
    async () => {
      console.log("course" + id + "is cached");
      return await db.query.CourseTable.findFirst({
        columns: { id: true, name: true, description: true },
        where: eq(CourseTable.id, id),
        with: {
          courseSections: {
            orderBy: asc(CourseSectionTable.order),
            columns: { id: true, status: true, name: true },
            with: {
              lessons: {
                orderBy: asc(LessonTable.order),
                columns: {
                  id: true,
                  name: true,
                  status: true,
                  description: true,
                  youtubeVideoId: true,
                  courseSectionId: true,
                },
              },
            },
          },
        },
      });
    },
    [id],
    {
      tags: [
        getCourseIdTag(id),
        getCourseSectionCourseTag(id),
        getLessonCourseTag(id),
      ],
    }
  )();
