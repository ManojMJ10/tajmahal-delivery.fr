"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PublicOrderPage } from "@/components/public/PublicOrderPage";
import { clearPublicCartState, savePublicCartState, usePublicCartState } from "@/lib/publicCartStore";
import { initializeStore, saveLanguage, useLanguage, useMenuItems, useSettings } from "@/lib/menuStore";
import { translations } from "@/lib/publicContent";
import type { OrderType } from "@/lib/types";

interface PublicOrderClientProps {
  orderType: OrderType;
}

export default function PublicOrderClient({ orderType }: PublicOrderClientProps) {
  const settings = useSettings();
  const menuItems = useMenuItems();
  const language = useLanguage();
  const router = useRouter();
  const { cart, notes } = usePublicCartState();

  useEffect(() => {
    initializeStore();
  }, []);

  const t = translations[language];

  const publicMenuItems = menuItems.filter((item) => item.available && item.show_on_public);

  const backPath = orderType === "dine_in" ? "/" : `/menu/${orderType === "home_delivery" ? "home-delivery" : "takeaway"}`;
  const backLabel = orderType === "dine_in" ? (language === "fr" ? "Retour à l'accueil" : "Back to home") : t.backToMenu;

  return (
    <PublicOrderPage
      settings={settings}
      menuItems={publicMenuItems}
      cart={cart}
      notes={notes}
      language={language}
      setLanguage={saveLanguage}
      onBack={() => router.push(backPath)}
      onNoteChange={(itemId, value) => {
        const nextNotes = {
          ...notes,
          [itemId]: value,
        };

        if (!value.trim()) {
          delete nextNotes[itemId];
        }

        savePublicCartState({
          cart,
          notes: nextNotes,
        });
      }}
      orderType={orderType}
      backLabel={backLabel}
      onSubmitSuccess={() => {
        if (orderType !== "dine_in") clearPublicCartState();
      }}
      t={t}
    />
  );
}
