import PageHeader from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import { ProductForm } from "@/features/products/components/ProductForm";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export default async function Page() {
  const courses = await getCourses();
  return (
    <div className="container my-6 mx-auto">
      <PageHeader title="New Product" />
      <ProductForm courses={courses} />
    </div>
  );
}

const getCourses = unstable_cache(
  async () => {
    return await db.query.CourseTable.findMany({
      columns: { id: true, name: true },
      orderBy: asc(CourseTable.name),
    });
  },
  [],
  {
    tags: [getCourseGlobalTag()],
  }
);
