import { Flame } from "lucide-react";
import { getDishAllergens, getDishName, getFoodTypeLabel, getSpiceLabel, shouldShowSpiceLevel } from "@/lib/publicContent";
import type { AppSettings, Language, MenuItem } from "@/lib/types";

export function KioskDishCard({
  dish,
  settings,
  language,
}: {
  dish: MenuItem;
  settings: AppSettings;
  language: Language;
}) {
  const showSpice = settings.kiosk.showSpiceLevel && shouldShowSpiceLevel(dish);

  return (
    <article className="overflow-hidden rounded-[1.75rem] border-2 border-[#d9c4a6] bg-white shadow-[0_14px_32px_rgba(82,50,19,0.10)]">
      <div className="grid gap-0 xl:grid-cols-[260px_minmax(0,1fr)]">
        <img src={dish.image} alt={getDishName(dish, language)} className="h-56 w-full object-cover xl:h-full" />
        <div className="p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-3xl font-bold text-stone-950 lg:text-4xl">
                {getDishName(dish, language)}
              </h3>
              <p className="mt-3 text-base font-medium leading-7 text-stone-700 lg:text-lg">
                {language === "en" ? dish.description_en : dish.description_fr}
              </p>
            </div>
            <span className="rounded-full bg-[#8f5525] px-4 py-2 text-xl font-black text-white shadow-sm">
              {dish.price}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm lg:text-base">
            <span className={`inline-flex items-center rounded-full border px-4 py-2 font-bold ${showSpice ? dish.food_type === "veg" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800" : "border-[#dcc6a6] bg-[#f9f1e3] text-stone-800"}`}>
              {getFoodTypeLabel(dish, language)}
            </span>
            {showSpice ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#dcc6a6] bg-[#f9f1e3] px-4 py-2 font-bold text-stone-800">
                <Flame className="h-4 w-4" /> {getSpiceLabel(dish.spice_level, language)}
              </span>
            ) : null}
            {settings.kiosk.showAllergens ? (
              <span className="rounded-full border border-[#dcc6a6] bg-[#f9f1e3] px-4 py-2 font-semibold text-stone-800">
                {getDishAllergens(dish, language)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
