import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { getProductGlobalTag } from "@/features/products/db/cache";
import {
  CourseProductTable,
  ProductTable as DbProductTable,
  PurchaseTable,
} from "@/drizzle/schema";
import { asc, countDistinct, eq } from "drizzle-orm";
import { ProductTable } from "@/features/products/components/ProductTable";

export default async function Page() {
  const products = await getProducts();
  return (
    <div className="container my-6 mx-auto">
      <PageHeader title="Products">
        <Button asChild>
          <Link href="/admin/products/new">New Product</Link>
        </Button>
      </PageHeader>
      <ProductTable products={products} />
    </div>
  );
}

const getProducts = unstable_cache(
  async () => {
    console.log("courses dosen't cache");
    return await db
      .select({
        id: DbProductTable.id,
        name: DbProductTable.name,
        status: DbProductTable.status,
        priceInDollars: DbProductTable.priceInDollars,
        imageUrl: DbProductTable.imageUrl,
        description: DbProductTable.description,
        customersCount: countDistinct(PurchaseTable.userId),
        coursesCount: countDistinct(CourseProductTable.courseId),
      })
      .from(DbProductTable)
      .leftJoin(PurchaseTable, eq(PurchaseTable.productId, DbProductTable.id))
      .leftJoin(
        CourseProductTable,
        eq(CourseProductTable.productId, DbProductTable.id)
      )
      .orderBy(asc(DbProductTable.name))
      .groupBy(DbProductTable.id);
  },
  [],
  {
    tags: [getProductGlobalTag()],
  }
);
