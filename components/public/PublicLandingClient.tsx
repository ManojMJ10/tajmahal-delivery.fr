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
    <div className="min-h-screen bg-[#f7f1e8] text-stone-900">
      <PublicHeader
        settings={settings}
        language={language}
        setLanguage={saveLanguage}
        cartCount={0}
        onBack={() => {}}
        t={t}
      />
      <main className="mx-auto max-w-7xl px-4 pt-8 pb-0">
        <section className="animate-soft-rise relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
          <div className="grid items-center gap-4 px-6 py-8 md:grid-cols-[minmax(0,1fr)_500px] md:px-10 md:py-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">{t.heroLabel}</p>
              <h2 className="mt-3 max-w-md text-3xl font-black leading-[1.05] text-stone-950 md:text-4xl">
                {settings.publicSite.heroTitle[language]}
              </h2>
              <p className="mt-4 max-w-sm text-base leading-6 text-stone-600">
                {settings.publicSite.heroSubtitle[language]}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-600">
                <span className="rounded-full bg-stone-100 px-4 py-2">{settings.publicSite.openingHours}</span>
                <span className="rounded-full bg-stone-100 px-4 py-2">{settings.publicSite.restaurantAddress}</span>
                <span className="rounded-full bg-stone-100 px-4 py-2">{settings.publicSite.phoneNumber}</span>
              </div>
            </div>
            <div className="mx-auto overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-100 shadow-md">
              <img
                src="/restaurant/Taj_Mahal-16-1920w.png"
                alt="Taj Mahal restaurant exterior and terrace"
                className="aspect-[16/10] h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
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
              className={`animate-soft-rise rounded-[2rem] border p-6 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 ${
                dark
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-900"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  dark ? "bg-white/10 text-white" : "bg-stone-100 text-stone-700"
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-2xl font-black">{title}</h3>
              <p className={`mt-3 text-lg leading-8 ${dark ? "text-stone-200" : "text-stone-600"}`}>
                {description}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
