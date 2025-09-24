import PageHeader from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { CourseTable, ProductTable } from "@/drizzle/schema";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import { ProductForm } from "@/features/products/components/ProductForm";
import { getProductIdTag } from "@/features/products/db/cache";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProduct(productId);
  const courses = await getCourses();

  if (!product) return notFound();

  return (
    <div className="container my-6 mx-auto">
      <PageHeader title="Edit Product" />
      <ProductForm
        product={{
          ...product,
          courseIds: product.courseProducts.map((course) => course.courseId),
        }}
        courses={courses}
      />
    </div>
  );
}

const getProduct = (id: string) =>
  unstable_cache(
    async () => {
      return db.query.ProductTable.findFirst({
        where: eq(ProductTable.id, id),
        columns: {
          id: true,
          name: true,
          description: true,
          priceInDollars: true,
          status: true,
          imageUrl: true,
        },
        with: { courseProducts: { columns: { courseId: true } } },
      });
    },
    [id],
    {
      tags: [getProductIdTag(id)],
    }
  )();

const getCourses = unstable_cache(
  async () => {
    return await db.query.CourseTable.findMany({
      orderBy: CourseTable.name,
      columns: {
        id: true,
        name: true,
      },
    });
  },
  [],
  {
    tags: [getCourseGlobalTag()],
  }
);
