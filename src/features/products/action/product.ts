"use server";

import z from "zod";
import { productSchema } from "../schema/product";
import { canCreateProducts, canDeleteProducts } from "../permisson/product";
import { getCurrentUser } from "@/services/clerk";
import {
  insertProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
} from "../db/product";
import { canUpdateCourse } from "@/features/courses/permissions/courses";

export async function createProduct(unsafeData: z.infer<typeof productSchema>) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canCreateProducts(await getCurrentUser()))
    return {
      error: true,
      message: "Error creating your product",
    };

  await insertProduct(data);

  return {
    error: false,
    message: "Successfully creating your product",
  };
}

export async function updateProduct(
  id: string,
  unsafeData: z.infer<typeof productSchema>
) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canUpdateCourse(await getCurrentUser()))
    return {
      error: true,
      message: "Error updating your product",
    };

  await dbUpdateProduct(id, data);
  return {
    error: false,
    message: "Successfully updating your product",
  };
}

export async function deleteProduct(id: string) {
  if (!canDeleteProducts(await getCurrentUser()))
    return {
      error: true,
      message: "Error deleting your product",
    };

  await dbDeleteProduct(id);

  return {
    error: false,
    message: "Successfully deleting your product",
  };
}
