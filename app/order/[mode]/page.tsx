import { notFound } from "next/navigation";
import PublicOrderClient from "@/components/public/PublicOrderClient";
import { getOrderTypeFromSlug } from "@/lib/orderRoutes";

export default async function OrderModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  const orderType = getOrderTypeFromSlug(mode);

  if (!orderType) {
    notFound();
  }

  return <PublicOrderClient orderType={orderType} />;
}
