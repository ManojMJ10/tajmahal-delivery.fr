import { formatEuro, getDishName, parsePrice, translations } from "@/lib/publicContent";
import type { AppSettings, Language, MenuItem, OrderConfirmationPayload } from "@/lib/types";

type WebhookItem = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  unit_price_formatted: string;
  subtotal: number;
  subtotal_formatted: string;
  note: string;
};

function getOrderTypeLabel(orderType: OrderConfirmationPayload["orderType"], language: Language) {
  const t = translations[language];
  if (orderType === "dine_in") return t.dineIn;
  if (orderType === "takeaway") return t.takeAway;
  return t.homeDelivery;
}

function getItems(payload: OrderConfirmationPayload, menuItems: MenuItem[], language: Language): WebhookItem[] {
  return payload.items
    .map((line) => {
      const item = menuItems.find((candidate) => candidate.id === line.itemId);
      if (!item) return null;

      const unitPrice = parsePrice(item.price);
      const subtotal = unitPrice * line.quantity;

      return {
        id: item.id,
        name: getDishName(item, language),
        quantity: line.quantity,
        unit_price: unitPrice,
        unit_price_formatted: formatEuro(unitPrice),
        subtotal,
        subtotal_formatted: formatEuro(subtotal),
        note: line.note.trim(),
      };
    })
    .filter((item): item is WebhookItem => Boolean(item));
}

function getTotal(items: WebhookItem[]) {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

export async function sendN8nOrderWebhook({
  url,
  secret,
  settings,
  payload,
  menuItems,
  orderRef,
}: {
  url?: string;
  secret?: string;
  settings: AppSettings;
  payload: OrderConfirmationPayload;
  menuItems: MenuItem[];
  orderRef: string;
}) {
  if (!url) {
    return { skipped: true as const };
  }

  const items = getItems(payload, menuItems, payload.language);
  const total = getTotal(items);
  const totalFormatted = formatEuro(total);
  const orderTypeLabel = getOrderTypeLabel(payload.orderType, payload.language);

  const body = {
    event: "order.created",
    source: "tajmahalmarina-delivery.fr",
    orderRef,
    createdAt: new Date().toISOString(),
    language: payload.language,
    orderType: payload.orderType,
    orderTypeLabel,
    customer: {
      name: payload.customerName,
      phone: payload.phoneNumber,
      email: payload.email,
      guestCount: payload.guestCount,
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      postcode: payload.postcode,
      city: payload.city,
      notes: payload.notes,
    },
    schedule: {
      date: payload.date,
      timeSlot: payload.timeSlot,
    },
    restaurant: {
      name: settings.restaurantName,
      location: settings.location,
      phoneNumber: settings.publicSite.phoneNumber,
      address: settings.publicSite.restaurantAddress,
    },
    items,
    total,
    totalFormatted,
    whatsappMessage:
      payload.language === "fr"
        ? `Nouvelle commande ${settings.restaurantName}\nRef: ${orderRef}\nType: ${orderTypeLabel}\nClient: ${payload.customerName}\nTelephone: ${payload.phoneNumber}\nHoraire: ${payload.date || "aujourd'hui"} ${payload.timeSlot}\nTotal: ${totalFormatted}\nArticles: ${items
            .map((item) => `${item.name} x${item.quantity}`)
            .join(", ")}`
        : `New order ${settings.restaurantName}\nRef: ${orderRef}\nType: ${orderTypeLabel}\nCustomer: ${payload.customerName}\nPhone: ${payload.phoneNumber}\nTime: ${payload.date || "today"} ${payload.timeSlot}\nTotal: ${totalFormatted}\nItems: ${items
            .map((item) => `${item.name} x${item.quantity}`)
            .join(", ")}`,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "x-webhook-secret": secret } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n webhook failed (${response.status}): ${text || "Unknown error"}`);
  }

  return { skipped: false as const };
}
