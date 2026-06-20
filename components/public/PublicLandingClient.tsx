"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bike, ShoppingBag, Store } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { initializeStore, saveLanguage, useLanguage, useSettings } from "@/lib/menuStore";
import { translations } from "@/lib/publicContent";

function isRestaurantOpenNow() {
  const franceTime = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Paris",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const [hour, minute] = franceTime.split(":").map(Number);
  const minutesNow = hour * 60 + minute;
  const lunchOpen = 11 * 60 + 30;
  const lunchClose = 14 * 60 + 30;
  const dinnerOpen = 18 * 60 + 30;
  const dinnerClose = 23 * 60;

  return (
    (minutesNow >= lunchOpen && minutesNow < lunchClose) ||
    (minutesNow >= dinnerOpen && minutesNow < dinnerClose)
  );
}

export default function PublicLandingClient() {
  const router = useRouter();
  const settings = useSettings();
  const language = useLanguage();
  const [showClosedNotice, setShowClosedNotice] = useState(false);

  useEffect(() => {
    initializeStore();
  }, []);

  useEffect(() => {
    setShowClosedNotice(!isRestaurantOpenNow());
  }, []);

  const t = translations[language];
  const menuHref = useMemo(() => "/menu/takeaway", []);

  return (
    <div className="public-page-shell landing-ornament-shell min-h-screen bg-[#f7f1e8] text-stone-900">
      {showClosedNotice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(30,20,12,0.52)] px-4">
          <div className="w-full max-w-xl rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_24px_60px_rgba(26,16,10,0.24)] md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">{settings.restaurantName}</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-stone-950">{t.closedNowTitle}</h2>
            <p className="mt-3 text-base leading-7 text-stone-600">{t.closedNowMessage}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push(menuHref)}
                className="inline-flex items-center justify-center rounded-full border border-stone-900 bg-stone-900 px-5 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-stone-800"
              >
                {t.seeMenu}
              </button>
              <button
                type="button"
                onClick={() => setShowClosedNotice(false)}
                className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-800 transition-colors duration-150 hover:bg-stone-50"
              >
                {t.continueBrowsing}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <PublicHeader
        settings={settings}
        language={language}
        setLanguage={saveLanguage}
        cartCount={0}
        onBack={() => {}}
        t={t}
      />
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl flex-col justify-center px-4 pb-6 pt-16 sm:px-5 lg:pt-10">
        <section className="animate-soft-rise landing-hero-sheen relative overflow-hidden rounded-[1.8rem] border border-[var(--page-line)] shadow-[0_20px_48px_rgba(86,56,31,0.08)]">
          <div className="grid items-center gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_520px] md:px-8 md:py-7 xl:grid-cols-[minmax(0,1fr)_540px]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.38em] text-stone-500">{t.heroLabel}</p>
              <h2 className="font-display mt-3 max-w-xl text-[2.8rem] font-semibold leading-[0.92] text-stone-950 sm:text-[3.35rem] md:text-[4.4rem] xl:text-[4.7rem]">
                {settings.publicSite.heroTitle[language]}
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-stone-600 md:text-[1rem] md:leading-7">
                {settings.publicSite.heroSubtitle[language]}
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5 text-sm text-stone-600 md:text-[15px]">
                <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">{settings.publicSite.openingHours}</span>
                <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">{settings.publicSite.restaurantAddress}</span>
                <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">{settings.publicSite.phoneNumber}</span>
              </div>
              <div className="mt-5">
                <Link
                  href={menuHref}
                  className="inline-flex items-center rounded-full border border-stone-900 bg-stone-900 px-5 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-stone-800"
                >
                  {t.seeMenu}
                </Link>
              </div>
            </div>
            <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100 shadow-[0_18px_40px_rgba(40,25,12,0.16)]">
              <img
                src="/restaurant/Taj_Mahal-16-1920w.png"
                alt="Taj Mahal Marina restaurant exterior and terrace"
                className="aspect-[16/10] h-full w-full object-cover xl:aspect-[16/9.2]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(34,20,10,0.42)] to-transparent" />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3 md:gap-4">
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
              className={`animate-soft-rise rounded-[1.8rem] border p-5 text-left shadow-[0_16px_36px_rgba(86,56,31,0.07)] transition-transform duration-150 hover:-translate-y-0.5 md:min-h-[220px] md:p-5 ${
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
              <h3 className="font-display mt-5 text-[1.7rem] font-semibold leading-none md:text-[1.95rem]">{title}</h3>
              <p className={`mt-3 text-[15px] leading-7 md:text-base md:leading-7 ${dark ? "text-stone-200" : "text-stone-600"}`}>
                {description}
              </p>
            </Link>
          ))}
        </section>

      </main>
    </div>
  );
}
