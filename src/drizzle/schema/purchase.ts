import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelper";
import { UserTable } from "./user";
import { ProductTable } from "./product";
import { relations } from "drizzle-orm";

export const PurchaseTable = pgTable("purchases", {
  id,
  pricePaidInCents: integer("price_paid_in_cents").notNull(),
  productDetails: jsonb("product_details")
    .notNull()
    .$type<{ name: string; description: string; imageUrl: string }>(),
  userId: uuid("user_id")
    .notNull()
    .references(() => UserTable.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => ProductTable.id),
  stripSessionId: text("strip_session_id").notNull(),
  refundeAt: timestamp("refund_at", { withTimezone: true }),
  createdAt,
  updatedAt,
});

export const PurchaseRelationships = relations(PurchaseTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PurchaseTable.userId],
    references: [UserTable.id],
  }),
  product: one(ProductTable, {
    fields: [PurchaseTable.productId],
    references: [ProductTable.id],
  }),
}));
