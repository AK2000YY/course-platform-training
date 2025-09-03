import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { relations } from "drizzle-orm";
import { CourseProductTable } from "./courseProduct";

export const productStatuses = ["private", "public"] as const;
export type ProductStatus = (typeof productStatuses)[number];
export const productStatusesEnum = pgEnum("product_status", productStatuses);

export const ProductTable = pgTable("products", {
  id,
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  priceInDollars: integer("price_in_dollars").notNull(),
  status: productStatusesEnum("status").notNull().default("private"),
  createdAt,
  updatedAt,
});

export const ProductRelationships = relations(ProductTable, ({ many }) => ({
  courseProducts: many(CourseProductTable),
}));
