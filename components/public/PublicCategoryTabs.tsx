"use client";

import type { AppSettings, Language } from "@/lib/types";
import { getLocalizedCategoryLabel } from "@/lib/publicContent";

interface PublicCategoryTabsProps {
  settings: AppSettings;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  language: Language;
  compact?: boolean;
  selectedOnly?: boolean;
  sticky?: boolean;
}

export function PublicCategoryTabs({
  settings,
  selectedCategory,
  setSelectedCategory,
  language,
  compact = false,
  selectedOnly = false,
  sticky = false,
}: PublicCategoryTabsProps) {
  const visibleCategories = selectedOnly
    ? settings.categories.filter((category) => category.id === selectedCategory)
    : settings.categories;

  return (
    <section
      className={`z-30 border-b border-stone-200 bg-[#f7f1e8]/95 backdrop-blur ${
        sticky ? "sticky top-[72px]" : "relative"
      }`}
    >
      <div className={`mx-auto max-w-7xl px-4 ${compact ? "py-3" : "py-5"}`}>
        {!compact && !selectedOnly ? (
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-stone-500">
              {language === "fr" ? "Catégories" : "Categories"}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl md:text-5xl">
              {language === "fr" ? "Nos Plats" : "Our Dishes"}
            </h2>
          </div>
        ) : null}
        <div className={compact ? "" : "mt-5"}>
          <div
            className={`no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 ${
              compact ? "gap-2" : "gap-2.5 sm:gap-3"
            }`}
          >
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`shrink-0 snap-start whitespace-nowrap rounded-full border-2 font-bold transition-colors duration-150 ${
                  compact ? "px-4 py-2 text-sm" : "px-4 py-2.5 text-sm sm:px-5 sm:text-[15px]"
                } ${
                  selectedCategory === category.id
                    ? "border-stone-950 bg-stone-950 text-white shadow-sm"
                    : "border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                }`}
              >
                {getLocalizedCategoryLabel(settings, category.id, language)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
