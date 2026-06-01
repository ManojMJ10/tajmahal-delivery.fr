"use client";

import { Clock, Languages, MapPin, Phone, ShoppingCart } from "lucide-react";
import type { AppSettings, Language } from "@/lib/types";

interface PublicHeaderProps {
  settings: AppSettings;
  language: Language;
  cartCount: number;
  showBack?: boolean;
  onBack: () => void;
  onCartClick?: () => void;
  onDineInClick?: () => void;
  t: {
    openToday: string;
    backToMenu: string;
    cart: string;
    dineIn: string;
  };
  setLanguage: (language: Language) => void;
}

export function PublicHeader({
  settings,
  language,
  cartCount,
  showBack = false,
  onBack,
  onCartClick,
  onDineInClick,
  t,
  setLanguage,
}: PublicHeaderProps) {
  const cuisineLabel =
    language === "fr" ? "Restaurant indien et pakistanais" : "Indian & Pakistani Restaurant";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <button type="button" onClick={onBack} className="text-left">
          <h1 className="text-2xl font-black tracking-tight text-stone-950">
            {settings.restaurantName}
          </h1>
          <div className="mt-1 space-y-1 text-xs text-stone-500">
            <p className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {settings.location}
            </p>
            <p className="flex items-center gap-1 md:hidden">
              <Phone className="h-3 w-3" /> {settings.publicSite.phoneNumber}
            </p>
          </div>
        </button>

        <div className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {t.openToday}
          </span>
          <span>{cuisineLabel}</span>
          <span>{settings.publicSite.phoneNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            <Languages className="h-4 w-4" />
            {language === "en" ? "FR" : "EN"}
          </button>

          {!showBack && onDineInClick ? (
            <button
              type="button"
              onClick={onDineInClick}
              className="hidden rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-800 hover:bg-stone-50 sm:inline-flex"
            >
              {t.dineIn}
            </button>
          ) : null}

          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-50"
            >
              {t.backToMenu}
            </button>
          ) : (
            <button
              type="button"
              onClick={onCartClick}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm transition-colors duration-150 hover:bg-stone-800"
              aria-label={t.cart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-rose-100 px-1 text-xs font-black text-rose-700">
                  {cartCount}
                </span>
              ) : null}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
