"use client";

import Link from "next/link";
import { Bike, ShoppingBag, Store } from "lucide-react";
import { useEffect } from "react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { initializeStore, saveLanguage, useLanguage, useSettings } from "@/lib/menuStore";
import { translations } from "@/lib/publicContent";

export default function PublicLandingClient() {
  const settings = useSettings();
  const language = useLanguage();

  useEffect(() => {
    initializeStore();
  }, []);

  const t = translations[language];

  return (
    <div className="public-page-shell landing-ornament-shell min-h-screen bg-[#f7f1e8] text-stone-900">
      <PublicHeader
        settings={settings}
        language={language}
        setLanguage={saveLanguage}
        cartCount={0}
        onBack={() => {}}
        t={t}
      />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-5">
        <section className="animate-soft-rise landing-hero-sheen relative overflow-hidden rounded-[2rem] border border-[var(--page-line)] shadow-[0_24px_60px_rgba(86,56,31,0.08)]">
          <div className="grid items-center gap-6 px-5 py-6 md:grid-cols-[minmax(0,1fr)_560px] md:px-10 md:py-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.38em] text-stone-500">{t.heroLabel}</p>
              <h2 className="font-display mt-3 max-w-xl text-[3rem] font-semibold leading-[0.92] text-stone-950 sm:text-[3.6rem] md:text-[5rem]">
                {settings.publicSite.heroTitle[language]}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-stone-600 md:text-[1.08rem] md:leading-8">
                {settings.publicSite.heroSubtitle[language]}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-600 md:text-base">
                <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">{settings.publicSite.openingHours}</span>
                <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">{settings.publicSite.restaurantAddress}</span>
                <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">{settings.publicSite.phoneNumber}</span>
              </div>
            </div>
            <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100 shadow-[0_18px_40px_rgba(40,25,12,0.16)]">
              <img
                src="/restaurant/Taj_Mahal-16-1920w.png"
                alt="Taj Mahal Marina restaurant exterior and terrace"
                className="aspect-[16/10] h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(34,20,10,0.42)] to-transparent" />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:gap-5 lg:grid-cols-3">
          {[
            {
              href: "/order/dine-in",
              icon: Store,
              title: t.dineIn,
              description: settings.publicSite.dineInMessage,
              dark: false,
            },
            {
              href: "/menu/takeaway",
              icon: ShoppingBag,
              title: t.takeAway,
              description: settings.publicSite.takeawayMessage,
              dark: false,
            },
            {
              href: "/menu/home-delivery",
              icon: Bike,
              title: t.homeDelivery,
              description: settings.publicSite.deliveryMessage,
              dark: true,
            },
          ].map(({ href, icon: Icon, title, description, dark }) => (
            <Link
              key={title}
              href={href}
              className={`animate-soft-rise rounded-[2rem] border p-6 text-left shadow-[0_16px_36px_rgba(86,56,31,0.07)] transition-transform duration-150 hover:-translate-y-0.5 md:p-7 ${
                dark
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white/90 text-stone-900"
              }`}
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  dark ? "bg-white/10 text-white" : "bg-stone-100 text-stone-700"
                }`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display mt-6 text-[1.85rem] font-semibold leading-none md:text-[2.15rem]">{title}</h3>
              <p className={`mt-4 text-base leading-7 md:text-lg md:leading-8 ${dark ? "text-stone-200" : "text-stone-600"}`}>
                {description}
              </p>
            </Link>
          ))}
        </section>

      </main>
    </div>
  );
}
