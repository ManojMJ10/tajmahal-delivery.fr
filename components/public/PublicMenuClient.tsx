"use client";

import { ArrowUp, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeStore, saveLanguage, useLanguage, useMenuItems, useSettings } from "@/lib/menuStore";
import { getDishDescription, getDishName, translations } from "@/lib/publicContent";
import { PublicCategoryTabs } from "@/components/public/PublicCategoryTabs";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicMenuCard } from "@/components/public/PublicMenuCard";
import type { OrderType } from "@/lib/types";
import { getPublicCartState, savePublicCartState, usePublicCartState } from "@/lib/publicCartStore";

interface PublicMenuClientProps {
  orderType: OrderType;
}

export default function PublicMenuClient({ orderType }: PublicMenuClientProps) {
  const settings = useSettings();
  const menuItems = useMenuItems();
  const language = useLanguage();
  const router = useRouter();
  const { cart, notes } = usePublicCartState();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    initializeStore();
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const t = translations[language];
  const publicMenuItems = useMemo(
    () => menuItems.filter((item) => item.available && item.show_on_public),
    [menuItems]
  );

  const filteredItems = useMemo(
    () =>
      publicMenuItems.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        const query = search.toLowerCase();
        const matchesSearch =
          getDishName(item, language).toLowerCase().includes(query) ||
          getDishDescription(item, language).toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      }),
    [publicMenuItems, selectedCategory, search, language]
  );

  const cartCount = Object.values(cart).reduce((total, quantity) => total + Number(quantity || 0), 0);

  const persistCart = (nextCart: Record<string, number>, nextNotes: Record<string, string>) => {
    savePublicCartState({
      cart: nextCart,
      notes: nextNotes,
    });
  };

  const increaseCart = (itemId: string) => {
    const currentState = getPublicCartState();
    persistCart(
      { ...currentState.cart, [itemId]: (currentState.cart[itemId] || 0) + 1 },
      currentState.notes
    );
  };

  const decreaseCart = (itemId: string) => {
    const currentState = getPublicCartState();
    const nextQuantity = Math.max(0, (currentState.cart[itemId] || 0) - 1);
    const nextCart = { ...currentState.cart, [itemId]: nextQuantity };

    if (nextQuantity === 0) delete nextCart[itemId];

    persistCart(nextCart, currentState.notes);
  };

  const updateNote = (itemId: string, note: string) => {
    const currentState = getPublicCartState();
    const nextNotes = { ...currentState.notes, [itemId]: note };

    if (!note.trim()) delete nextNotes[itemId];

    persistCart(currentState.cart, nextNotes);
  };

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 720);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const orderTypeLabel =
    orderType === "takeaway" ? t.takeAway : orderType === "home_delivery" ? t.homeDelivery : t.dineIn;

  return (
    <div className="public-page-shell min-h-screen bg-[#f7f1e8] text-stone-900">
      <PublicHeader
        settings={settings}
        language={language}
        setLanguage={saveLanguage}
        cartCount={cartCount}
        onBack={() => router.push("/")}
        onCartClick={() => router.push(`/order/${orderType === "home_delivery" ? "home-delivery" : "takeaway"}`)}
        t={t}
      />
      <PublicCategoryTabs
        settings={settings}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        language={language}
      />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-10">
        <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-6 shadow-sm md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-stone-500">{t.order}</p>
          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-stone-950 md:text-4xl">{orderTypeLabel}</h1>
              <p className="mt-2 max-w-2xl text-stone-600">
                {orderType === "takeaway" ? settings.publicSite.takeawayMessage : settings.publicSite.deliveryMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/order/${orderType === "home_delivery" ? "home-delivery" : "takeaway"}`)}
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-bold text-white"
            >
              {t.cart}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-semibold text-stone-600">
              {t.showing} {filteredItems.length} {t.items}
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
              className="w-full rounded-full border border-stone-200 bg-white py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>
        </div>

        <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <PublicMenuCard
              key={item.id}
              item={item}
              settings={settings}
              language={language}
              quantity={cart[item.id] || 0}
              note={notes[item.id] || ""}
              onIncrease={() => increaseCart(item.id)}
              onDecrease={() => decreaseCart(item.id)}
              onNoteChange={(note) => updateNote(item.id, note)}
              t={t}
            />
          ))}
        </section>
      </main>
      {showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-stone-900 bg-stone-900 text-white shadow-[0_12px_28px_rgba(38,29,23,0.28)]"
          aria-label={language === "fr" ? "Retour en haut" : "Back to top"}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
