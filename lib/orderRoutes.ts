import type { OrderType } from "@/lib/types";

export type OrderRouteSlug = "dine-in" | "takeaway" | "home-delivery";

export function getOrderTypeFromSlug(slug: string): OrderType | null {
  if (slug === "dine-in") return "dine_in";
  if (slug === "takeaway") return "takeaway";
  if (slug === "home-delivery") return "home_delivery";
  return null;
}

export function getSlugFromOrderType(orderType: OrderType): OrderRouteSlug {
  if (orderType === "dine_in") return "dine-in";
  if (orderType === "takeaway") return "takeaway";
  return "home-delivery";
}
