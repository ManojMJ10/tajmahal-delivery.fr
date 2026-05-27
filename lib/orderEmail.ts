import { formatEuro, getDishName, parsePrice, translations } from "@/lib/publicContent";
import type { AppSettings, Language, MenuItem, OrderConfirmationPayload, OrderType } from "@/lib/types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getOrderTypeLabel(orderType: OrderType, language: Language) {
  const t = translations[language];
  if (orderType === "dine_in") return t.dineIn;
  if (orderType === "takeaway") return t.takeAway;
  return t.homeDelivery;
}

function formatDate(date: string, language: Language) {
  if (!date) return language === "fr" ? "Non precisee" : "Not provided";
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getItemRows(payload: OrderConfirmationPayload, menuItems: MenuItem[], language: Language) {
  return payload.items
    .map((line) => {
      const item = menuItems.find((candidate) => candidate.id === line.itemId);
      if (!item) return null;
      const unitPrice = parsePrice(item.price);
      const subtotal = unitPrice * line.quantity;

      return {
        name: getDishName(item, language),
        quantity: line.quantity,
        unitPrice: formatEuro(unitPrice),
        subtotal: formatEuro(subtotal),
        note: line.note.trim(),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function getTotal(itemRows: ReturnType<typeof getItemRows>) {
  return itemRows.reduce((sum, row) => sum + parsePrice(row.subtotal), 0);
}

export function buildOrderConfirmationEmail({
  settings,
  payload,
  menuItems,
  subject,
  intro,
  heading,
}: {
  settings: AppSettings;
  payload: OrderConfirmationPayload;
  menuItems: MenuItem[];
  subject?: string;
  intro?: string;
  heading?: string;
}) {
  const language = payload.language;
  const t = translations[language];
  const orderLabel = getOrderTypeLabel(payload.orderType, language);
  const itemRows = getItemRows(payload, menuItems, language);
  const total = formatEuro(getTotal(itemRows));
  const orderRef = `TM-${Date.now().toString().slice(-8)}`;
  const introText =
    intro ||
    (language === "fr"
      ? "Merci pour votre commande. Voici le recapitulatif complet envoye par Taj Mahal."
      : "Thank you for your order. Here is the complete confirmation from Taj Mahal.");

  const detailsRows = [
    [language === "fr" ? "Type de commande" : "Order type", orderLabel],
    [t.customerName, payload.customerName],
    [t.phoneNumber, payload.phoneNumber],
    [t.emailForUpdates, payload.email],
    payload.orderType === "home_delivery"
      ? [t.deliveryAddress, [payload.addressLine1, payload.addressLine2].filter(Boolean).join(", ")]
      : null,
    payload.orderType === "dine_in"
      ? [t.guestsTime, String(payload.guestCount)]
      : null,
    [language === "fr" ? "Date" : "Date", formatDate(payload.date, language)],
    [t.timeSlot, payload.timeSlot || (language === "fr" ? "Non precise" : "Not provided")],
    payload.notes.trim()
      ? [t.notes, payload.notes.trim()]
      : null,
  ].filter((row): row is [string, string] => Boolean(row));

  const detailsHtml = detailsRows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;color:#57534e;font-size:14px;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;color:#111827;font-size:14px;text-align:right;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");

  const itemsHtml = itemRows
    .map(
      (row) => `
        <tr>
          <td style="padding:16px 0;border-top:1px solid #e7e5e4;">
            <div style="font-size:15px;font-weight:700;color:#111827;">${escapeHtml(row.name)}</div>
            ${
              row.note
                ? `<div style="margin-top:6px;font-size:13px;color:#57534e;">${escapeHtml(t.itemNote)}: ${escapeHtml(row.note)}</div>`
                : ""
            }
          </td>
          <td style="padding:16px 0;border-top:1px solid #e7e5e4;font-size:14px;color:#111827;text-align:center;">x${row.quantity}</td>
          <td style="padding:16px 0;border-top:1px solid #e7e5e4;font-size:14px;color:#111827;text-align:right;">${escapeHtml(row.unitPrice)}</td>
          <td style="padding:16px 0;border-top:1px solid #e7e5e4;font-size:14px;font-weight:700;color:#111827;text-align:right;">${escapeHtml(row.subtotal)}</td>
        </tr>
      `
    )
    .join("");

  const emailSubject =
    subject ||
    (language === "fr"
      ? `Confirmation Taj Mahal ${orderRef}`
      : `Taj Mahal confirmation ${orderRef}`);

  const html = `
    <div style="margin:0;padding:32px 16px;background:#f5f5f4;font-family:Georgia, 'Times New Roman', serif;">
      <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e7e5e4;border-radius:28px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.08);">
        <div style="padding:32px 36px;background:linear-gradient(180deg,#fafaf9 0%,#f5f5f4 100%);border-bottom:1px solid #e7e5e4;">
          <div style="font-size:12px;letter-spacing:0.35em;text-transform:uppercase;color:#78716c;font-weight:800;">Taj Mahal</div>
          <h1 style="margin:12px 0 0;font-size:42px;line-height:1;color:#111827;">${escapeHtml(heading || orderLabel)}</h1>
          <p style="margin:14px 0 0;font-size:16px;line-height:1.7;color:#44403c;">${escapeHtml(introText)}</p>
          <div style="margin-top:18px;font-size:13px;color:#57534e;">
            ${escapeHtml(settings.publicSite.restaurantAddress)}<br />
            ${escapeHtml(settings.publicSite.phoneNumber)}
          </div>
        </div>

        <div style="padding:32px 36px;">
          <div style="padding:20px 24px;border:1px solid #e7e5e4;border-radius:22px;background:#fafaf9;">
            <div style="font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#78716c;font-weight:800;">${language === "fr" ? "Reference" : "Reference"}</div>
            <div style="margin-top:8px;font-size:22px;font-weight:800;color:#111827;">${escapeHtml(orderRef)}</div>
          </div>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;">
            ${detailsHtml}
          </table>

          <div style="margin-top:30px;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;color:#78716c;font-weight:800;">
            ${escapeHtml(t.selectedItems)}
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
            <thead>
              <tr>
                <th align="left" style="padding:0 0 10px;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:0.18em;">${escapeHtml(t.item)}</th>
                <th align="center" style="padding:0 0 10px;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:0.18em;">${escapeHtml(t.qty)}</th>
                <th align="right" style="padding:0 0 10px;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:0.18em;">${escapeHtml(t.price)}</th>
                <th align="right" style="padding:0 0 10px;font-size:12px;color:#78716c;text-transform:uppercase;letter-spacing:0.18em;">${escapeHtml(t.subtotal)}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e7e5e4;display:flex;justify-content:space-between;gap:16px;">
            <div style="font-size:13px;line-height:1.7;color:#57534e;max-width:420px;">
              ${escapeHtml(t.serviceNote)}
            </div>
            <div style="text-align:right;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#78716c;font-weight:800;">${escapeHtml(t.total)}</div>
              <div style="margin-top:6px;font-size:28px;font-weight:900;color:#111827;">${escapeHtml(total)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const textLines = [
    `Taj Mahal - ${orderLabel}`,
    orderRef,
    "",
    introText,
    "",
    `${language === "fr" ? "Type de commande" : "Order type"}: ${orderLabel}`,
    `${t.customerName}: ${payload.customerName}`,
    `${t.phoneNumber}: ${payload.phoneNumber}`,
    `${t.emailForUpdates}: ${payload.email}`,
    payload.orderType === "home_delivery"
      ? `${t.deliveryAddress}: ${[payload.addressLine1, payload.addressLine2].filter(Boolean).join(", ")}`
      : null,
    payload.orderType === "dine_in" ? `${t.guestsTime}: ${payload.guestCount}` : null,
    `${language === "fr" ? "Date" : "Date"}: ${formatDate(payload.date, language)}`,
    `${t.timeSlot}: ${payload.timeSlot || (language === "fr" ? "Non precise" : "Not provided")}`,
    payload.notes.trim() ? `${t.notes}: ${payload.notes.trim()}` : null,
    "",
    t.selectedItems,
    ...itemRows.flatMap((row) => [
      `${row.name} x${row.quantity} - ${row.subtotal}`,
      row.note ? `${t.itemNote}: ${row.note}` : null,
    ]),
    "",
    `${t.total}: ${total}`,
  ].filter((line): line is string => Boolean(line));

  return {
    subject: emailSubject,
    html,
    text: textLines.join("\n"),
  };
}
