import { Resend } from "resend";
import { NextResponse } from "next/server";
import { defaultMenu } from "@/data/defaultMenu";
import { defaultSettings } from "@/data/defaultSettings";
import { buildOrderConfirmationEmail } from "@/lib/orderEmail";
import { translations } from "@/lib/publicContent";
import type { OrderConfirmationPayload } from "@/lib/types";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPayload(payload: OrderConfirmationPayload) {
  if (!payload.customerName.trim()) return false;
  if (!payload.phoneNumber.trim()) return false;
  if (!isValidEmail(payload.email.trim())) return false;
  if (!payload.timeSlot.trim()) return false;
  if (!Array.isArray(payload.items) || payload.items.length === 0) return false;
  if (payload.orderType === "home_delivery" && !payload.addressLine1.trim()) return false;
  if ((payload.orderType === "dine_in" || payload.orderType === "takeaway") && !payload.date.trim()) return false;
  if (payload.orderType === "dine_in" && payload.guestCount < 1) return false;
  return true;
}

function getEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const ownerEmail = process.env.RESTAURANT_ORDER_EMAIL;

  if (!apiKey || !from || !ownerEmail) {
    return null;
  }

  return { apiKey, from, ownerEmail };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderConfirmationPayload;

    if (!isValidPayload(payload)) {
      return NextResponse.json(
        { error: "Please complete all required order details before sending." },
        { status: 400 }
      );
    }

    const env = getEnv();

    if (!env) {
      return NextResponse.json(
        {
          error:
            "Email sending is not configured yet. Add RESEND_API_KEY, RESEND_FROM_EMAIL, and RESTAURANT_ORDER_EMAIL in the server environment.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(env.apiKey);
    const customerEmail = buildOrderConfirmationEmail({
      settings: defaultSettings,
      payload,
      menuItems: defaultMenu,
    });
    const language = payload.language;
    const t = translations[language];
    const ownerEmail = buildOrderConfirmationEmail({
      settings: defaultSettings,
      payload,
      menuItems: defaultMenu,
      subject:
        language === "fr"
          ? `Nouvelle commande ${payload.customerName}`
          : `New order ${payload.customerName}`,
      intro:
        language === "fr"
          ? "Une nouvelle commande a ete soumise depuis le site Taj Mahal."
          : "A new order has been placed from the Taj Mahal website.",
      heading:
        language === "fr"
          ? "Notification restaurant"
          : "Restaurant notification",
    });

    const [customerResult, ownerResult] = await Promise.all([
      resend.emails.send({
        from: env.from,
        to: payload.email.trim(),
        subject: customerEmail.subject,
        html: customerEmail.html,
        text: customerEmail.text,
        replyTo: env.ownerEmail,
      }),
      resend.emails.send({
        from: env.from,
        to: env.ownerEmail,
        subject: ownerEmail.subject,
        html: ownerEmail.html,
        text: ownerEmail.text,
        replyTo: payload.email.trim(),
      }),
    ]);

    if (customerResult.error || ownerResult.error) {
      const message = customerResult.error?.message || ownerResult.error?.message || "Email sending failed.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message:
        language === "fr"
          ? "La commande a ete envoyee et les e-mails de confirmation ont ete livres."
          : "The order was placed and both confirmation emails were sent.",
    });
  } catch (error) {
    console.error("send-order-email failed", error);
    return NextResponse.json(
      {
        error:
          "The order confirmation could not be sent. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
