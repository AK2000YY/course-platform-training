import { getGlobalTag, getIdTag } from "@/lib/dataCach";
import { revalidateTag } from "next/cache";

export function getProductGlobalTag() {
  return getGlobalTag("product");
}

export function getProductIdTag(id: string) {
  return getIdTag("product", id);
}

export function revalidateProductCache(id: string) {
  revalidateTag(getProductGlobalTag());
  revalidateTag(getProductIdTag(id));
}
