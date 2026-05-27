"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { initializeStore, saveLanguage, useLanguage, useMenuItems, useSettings } from "@/lib/menuStore";
import { getLocalizedCategoryLabel, translations } from "@/lib/publicContent";
import type { MenuItem } from "@/lib/types";
import { KioskDishCard } from "@/components/kiosk/KioskDishCard";
import { KioskHero } from "@/components/kiosk/KioskHero";

function pickVisibleDishes(menuItems: MenuItem[]) {
  return menuItems.filter((item) => item.available && item.show_on_kiosk);
}

export default function KioskMenu() {
  const settings = useSettings();
  const menuItems = useMenuItems();
  const language = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categorySectionRef = useRef<HTMLElement | null>(null);
  const [showCompactCategory, setShowCompactCategory] = useState(false);

  useEffect(() => {
    initializeStore();
  }, []);

  const t = translations[language];
  const visibleMenuItems = useMemo(() => pickVisibleDishes(menuItems), [menuItems]);
  const categoryGroups = useMemo(
    () =>
      settings.categories
        .filter((category) => category.id !== "all")
        .map((category) => ({
          ...category,
          dishes: visibleMenuItems.filter((item) => item.category === category.id),
        }))
        .filter((category) => category.dishes.length > 0),
    [settings.categories, visibleMenuItems]
  );
  const visibleGroups = useMemo(() => {
    if (selectedCategory === "all") {
      return categoryGroups;
    }

    return categoryGroups.filter((category) => category.id === selectedCategory);
  }, [categoryGroups, selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setShowCompactCategory(false);
      return;
    }

    const node = categorySectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCompactCategory(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-16px 0px 0px 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ead8b9_0%,#f5ead5_22%,#efe0c8_100%)] p-5 text-stone-950 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1800px] flex-col gap-5 bg-[radial-gradient(circle_at_top_left,rgba(198,122,46,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(130,87,37,0.12),transparent_24%)]">
        <KioskHero
          settings={settings}
          language={language}
          setLanguage={saveLanguage}
        />

        {showCompactCategory ? (
          <section className="sticky top-4 z-30 self-start rounded-full border-2 border-[#8f5525] bg-[#fff8ef]/95 px-4 py-3 shadow-[0_14px_32px_rgba(82,50,19,0.16)] backdrop-blur">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className="rounded-full bg-[#8f5525] px-5 py-2 text-base font-black text-white"
            >
              {getLocalizedCategoryLabel(settings, selectedCategory, language)}
            </button>
          </section>
        ) : null}

        <section className="rounded-[2rem] border-2 border-[#7f4a1f]/20 bg-[#fff8ef] p-5 shadow-[0_18px_45px_rgba(82,50,19,0.10)]">
          <div className="mb-4">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-[#8f5525]">
              Poster Space
            </p>
          </div>
          <div className="grid place-items-center rounded-[1.75rem] border-2 border-dashed border-[#d9c4a6] bg-white/80 p-4">
            <div className="grid aspect-[4/5] w-full max-w-[560px] place-items-center rounded-[1.5rem] border-2 border-[#e2cfb2] bg-[#f8f0e2] text-center text-stone-500">
              <span className="px-6 text-2xl font-semibold">Advertisement Poster</span>
            </div>
          </div>
        </section>

        <section
          ref={categorySectionRef}
          className="rounded-[2rem] border-2 border-[#7f4a1f]/20 bg-[#fff8ef] p-6 shadow-[0_18px_45px_rgba(82,50,19,0.10)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#8f5525]">{t.categories}</p>
              <h2 className="mt-3 font-serif text-4xl font-bold text-stone-950 lg:text-5xl">
                {t.ourDishes}
              </h2>
              <p className="mt-2 text-lg font-medium text-stone-700">
                {t.showing} {visibleMenuItems.length} {t.items}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {settings.categories
              .filter((category) => category.id === "all" || categoryGroups.some((group) => group.id === category.id))
              .map((category) => {
              const active = selectedCategory === category.id && settings.kiosk.highlightCategory;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full border-2 px-5 py-3 text-lg font-bold shadow-sm ${
                    active
                      ? "border-[#8f5525] bg-[#8f5525] text-white"
                      : "border-[#c9ae86] bg-white text-stone-800"
                  }`}
                >
                  {getLocalizedCategoryLabel(settings, category.id, language)}
                </button>
              );
            })}
          </div>
        </section>

        {visibleGroups.map((group) => (
          <section
            key={group.id}
            className="rounded-[2rem] border-2 border-[#7f4a1f]/20 bg-[#fff8ef] p-6 shadow-[0_18px_45px_rgba(82,50,19,0.10)] lg:p-8"
          >
            <div className="flex flex-col gap-4 border-b-2 border-[#e2cfb2] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#8f5525]">{t.currentCategory}</p>
                <h2 className="mt-3 font-serif text-4xl font-bold text-stone-950 lg:text-6xl">
                  {getLocalizedCategoryLabel(settings, group.id, language)}
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {group.dishes.map((dish) => (
                <KioskDishCard key={dish.id} dish={dish} settings={settings} language={language} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
