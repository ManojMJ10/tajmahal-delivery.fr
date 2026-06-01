import { notFound } from "next/navigation";
import PublicMenuClient from "@/components/public/PublicMenuClient";
import { getOrderTypeFromSlug } from "@/lib/orderRoutes";

export default async function MenuModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  const orderType = getOrderTypeFromSlug(mode);

  if (!orderType || orderType === "dine_in") {
    notFound();
  }

  return <PublicMenuClient orderType={orderType} />;
}
