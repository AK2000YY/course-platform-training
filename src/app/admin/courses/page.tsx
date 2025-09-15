import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import {
  CourseSectionTable,
  CourseTable as DbCourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { asc, countDistinct, eq } from "drizzle-orm";
import { getUserCourseAccessGlobalTag } from "@/features/courses/db/cache/userCourseAccess";
import { getCourseSectionGlobalTag } from "@/features/courseSections/db/cache";
import { getLessonGlobalTag } from "@/features/lessons/db/cache/lesson";

export default async function Page() {
  const courses = await getCourses();
  return (
    <div className="container my-6 mx-auto">
      <PageHeader title="Courses">
        <Button asChild>
          <Link href="/admin/courses/new">New Course</Link>
        </Button>
      </PageHeader>
      <CourseTable courses={courses} />
    </div>
  );
}

const getCourses = unstable_cache(
  async () => {
    console.log("courses dosen't cache");
    return await db
      .select({
        id: DbCourseTable.id,
        name: DbCourseTable.name,
        description: DbCourseTable.description,
        sectionsCount: countDistinct(CourseSectionTable),
        lessonsCount: countDistinct(LessonTable),
        studentsCount: countDistinct(UserCourseAccessTable),
      })
      .from(DbCourseTable)
      .leftJoin(
        CourseSectionTable,
        eq(CourseSectionTable.courseId, DbCourseTable.id)
      )
      .leftJoin(
        LessonTable,
        eq(LessonTable.courseSectionId, CourseSectionTable.id)
      )
      .leftJoin(
        UserCourseAccessTable,
        eq(UserCourseAccessTable.courseId, DbCourseTable.id)
      )
      .orderBy(asc(DbCourseTable.name))
      .groupBy(DbCourseTable.id);
  },
  [],
  {
    tags: [
      getCourseGlobalTag(),
      getUserCourseAccessGlobalTag(),
      getCourseSectionGlobalTag(),
      getLessonGlobalTag(),
    ],
  }
);
