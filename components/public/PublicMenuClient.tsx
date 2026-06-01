"use client";

import { Bike, Search, ShoppingBag, Store } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { initializeStore, saveLanguage, useLanguage, useMenuItems, useSettings } from "@/lib/menuStore";
import { getDishDescription, getDishName, translations } from "@/lib/publicContent";
import { PublicCategoryTabs } from "@/components/public/PublicCategoryTabs";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicMenuCard } from "@/components/public/PublicMenuCard";
import { PublicOrderPage } from "@/components/public/PublicOrderPage";

type PageMode = "menu" | "order";

export default function PublicMenuClient() {
  const settings = useSettings();
  const menuItems = useMenuItems();
  const language = useLanguage();
  const [page, setPage] = useState<PageMode>("menu");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [initialOrderOption, setInitialOrderOption] = useState<string | null>(null);
  const dishesSectionRef = useRef<HTMLDivElement | null>(null);
  const categoryTabsRef = useRef<HTMLDivElement | null>(null);
  const didMountCategoryRef = useRef(false);
  const [showCompactCategory, setShowCompactCategory] = useState(false);

  useEffect(() => {
    initializeStore();
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

  const increaseCart = (itemId: string) => {
    setCart((current) => ({ ...current, [itemId]: (current[itemId] || 0) + 1 }));
  };

  const decreaseCart = (itemId: string) => {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[itemId] || 0) - 1);
      const updated = { ...current, [itemId]: nextQuantity };
      if (nextQuantity === 0) delete updated[itemId];
      return updated;
    });
  };

  const updateNote = (itemId: string, note: string) => {
    setNotes((current) => {
      const updated = { ...current, [itemId]: note };
      if (!note.trim()) delete updated[itemId];
      return updated;
    });
  };

  const scrollToDishes = () => {
    dishesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCart = () => {
    setInitialOrderOption(null);
    setPage("order");
  };

  const openDineIn = () => {
    setInitialOrderOption(t.dineIn);
    setPage("order");
  };

  const openTakeAway = () => {
    setInitialOrderOption(t.takeAway);
    setPage("order");
  };

  const openHomeDelivery = () => {
    setInitialOrderOption(t.homeDelivery);
    setPage("order");
  };

  useEffect(() => {
    if (!didMountCategoryRef.current) {
      didMountCategoryRef.current = true;
      return;
    }

    dishesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setShowCompactCategory(false);
      return;
    }

    const node = categoryTabsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCompactCategory(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-72px 0px 0px 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [selectedCategory]);

  if (page === "order") {
    return (
      <PublicOrderPage
        settings={settings}
        menuItems={publicMenuItems}
        cart={cart}
        notes={notes}
        language={language}
        setLanguage={saveLanguage}
        onBack={() => setPage("menu")}
        onNoteChange={updateNote}
        initialOption={initialOrderOption}
        t={t}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f1e8] text-stone-900">
      <PublicHeader
        settings={settings}
        language={language}
        setLanguage={saveLanguage}
        cartCount={cartCount}
        onBack={() => setPage("menu")}
        onCartClick={openCart}
        onDineInClick={openDineIn}
        t={t}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {selectedCategory === "all" ? (
          <>
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
                  icon: Store,
                  title: t.dineIn,
                  description: settings.publicSite.dineInMessage,
                  onClick: openDineIn,
                  dark: false,
                },
                {
                  icon: ShoppingBag,
                  title: t.takeAway,
                  description: settings.publicSite.takeawayMessage,
                  onClick: openTakeAway,
                  dark: false,
                },
                {
                  icon: Bike,
                  title: t.homeDelivery,
                  description: settings.publicSite.deliveryMessage,
                  onClick: openHomeDelivery,
                  dark: true,
                },
              ].map(({ icon: Icon, title, description, onClick, dark }) => (
                <button
                  key={title}
                  type="button"
                  onClick={onClick}
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
                </button>
              ))}
            </section>
          </>
        ) : null}
      </main>
      {showCompactCategory ? (
        <PublicCategoryTabs
          settings={settings}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          language={language}
          compact
          selectedOnly
          sticky
        />
      ) : null}
      <div ref={categoryTabsRef}>
        <PublicCategoryTabs
          settings={settings}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          language={language}
        />
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div
          ref={dishesSectionRef}
          className={`animate-soft-rise flex flex-col justify-between gap-4 md:flex-row md:items-center ${
            selectedCategory === "all" ? "mt-8 scroll-mt-36" : "mt-6 scroll-mt-28"
          }`}
          style={{ animationDelay: "70ms" }}
        >
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
          {filteredItems.map((item, index) => (
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
              revealDelay={index * 35}
              t={t}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
