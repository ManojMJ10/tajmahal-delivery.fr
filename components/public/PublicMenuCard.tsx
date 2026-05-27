"use client";

import { Flame, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  getDishAllergens,
  getDishDescription,
  getDishName,
  getFoodTypeLabel,
  getLocalizedCategoryLabel,
  getSpiceLabel,
  shouldShowSpiceLevel,
} from "@/lib/publicContent";
import type { AppSettings, Language, MenuItem } from "@/lib/types";

interface PublicMenuCardProps {
  item: MenuItem;
  settings: AppSettings;
  language: Language;
  quantity: number;
  note: string;
  revealDelay?: number;
  t: {
    addToCart: string;
    addNote: string;
    editNote: string;
    itemNotePlaceholder: string;
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onNoteChange: (value: string) => void;
}

export function PublicMenuCard({
  item,
  settings,
  language,
  quantity,
  note,
  revealDelay = 0,
  t,
  onIncrease,
  onDecrease,
  onNoteChange,
}: PublicMenuCardProps) {
  const [showNote, setShowNote] = useState(Boolean(note));
  const isVegetarian = item.food_type === "veg";
  const showSpice = shouldShowSpiceLevel(item);

  return (
    <div
      className="card-subtle-motion animate-soft-rise overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm hover:border-stone-300 hover:shadow-md"
      style={{ animationDelay: `${revealDelay}ms` }}
    >
      <div className="relative h-44 overflow-hidden bg-stone-100">
        <img src={item.image} alt={getDishName(item, language)} className="h-full w-full object-cover" />
        <div className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow-sm">
          <ShoppingCart className="h-5 w-5 text-stone-800" />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {getLocalizedCategoryLabel(settings, item.category, language)}
            </p>
            <h3 className="mt-1 text-xl font-bold text-stone-950">{getDishName(item, language)}</h3>
          </div>
          <p className="text-lg font-black text-stone-900">{item.price}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-stone-600">{getDishDescription(item, language)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {showSpice ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              <Flame className="h-3.5 w-3.5" /> {getSpiceLabel(item.spice_level, language)}
            </span>
          ) : null}
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
              showSpice
                ? isVegetarian
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-rose-100 bg-rose-50 text-rose-700"
                : "border-stone-200 bg-stone-50 text-stone-700"
            }`}
          >
            {getFoodTypeLabel(item, language)}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
            {getDishAllergens(item, language)}
          </span>
        </div>
        <div className="mt-5">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={onIncrease}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-stone-800"
            >
              <ShoppingCart className="h-4 w-4" /> {t.addToCart}
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-full border border-stone-300 bg-stone-50 px-3 py-2">
              <button
                type="button"
                onClick={onDecrease}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white hover:bg-stone-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-black text-stone-950">{quantity}</span>
              <button
                type="button"
                onClick={onIncrease}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-white hover:bg-stone-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowNote((value) => !value)}
            className="flex w-full items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 transition-colors duration-150 hover:bg-stone-50"
          >
            {note ? t.editNote : t.addNote}
          </button>
          {showNote ? (
            <textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300"
              placeholder={t.itemNotePlaceholder}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
