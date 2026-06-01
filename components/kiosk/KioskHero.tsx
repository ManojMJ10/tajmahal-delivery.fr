import { Clock3, Languages, MapPin, Phone } from "lucide-react";
import { translations } from "@/lib/publicContent";
import type { Language } from "@/lib/types";
import type { AppSettings } from "@/lib/types";

export function KioskHero({
  settings,
  language,
  setLanguage,
}: {
  settings: AppSettings;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const t = translations[language];
  const kioskSubtitle =
    language === "fr" ? "Restaurant indien et pakistanais" : "Indian & Pakistani Restaurant";

  return (
    <section className="grid gap-5 rounded-[2rem] border-2 border-[#7f4a1f]/20 bg-[linear-gradient(135deg,#fff8ef_0%,#f5e7cf_55%,#f0dcc1_100%)] p-8 shadow-[0_22px_55px_rgba(82,50,19,0.14)] lg:grid-cols-[1.45fr_0.75fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#8f5525]">
          {settings.location}
        </p>
        <h1 className="mt-3 font-serif text-6xl font-bold tracking-tight text-stone-950 lg:text-8xl">
          {settings.kiosk.heading}
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-[#7a4d25] lg:text-4xl">{kioskSubtitle}</h2>
        <div className="mt-6 grid gap-3 text-base font-semibold text-stone-800">
          <div className="rounded-[1.5rem] border-2 border-[#d7c19f] bg-white px-5 py-4 shadow-[0_12px_24px_rgba(82,50,19,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8f5525]">
              {language === "fr" ? "Adresse" : "Address"}
            </p>
            <p className="mt-2 flex items-start gap-3 text-base font-semibold leading-6 text-stone-800 lg:text-lg">
              <MapPin className="mt-1 h-4 w-4 shrink-0" />
              <span>{settings.publicSite.restaurantAddress}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#d7c19f] bg-white px-4 py-2 shadow-[0_10px_18px_rgba(82,50,19,0.06)]">
              <Phone className="h-4 w-4" /> {settings.publicSite.phoneNumber}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#d7c19f] bg-white px-4 py-2 shadow-[0_10px_18px_rgba(82,50,19,0.06)]">
            <Clock3 className="h-4 w-4" /> {settings.publicSite.openingHours}
            </span>
          </div>
        </div>
      </div>

      <div className="grid content-start gap-3 rounded-[1.75rem] border-2 border-[#d8c29f] bg-[#fffdf8] p-4">
        <div className="rounded-[1.5rem] border-2 border-[#caa46e] bg-[linear-gradient(135deg,#fffdf9_0%,#fff1d8_100%)] p-5 shadow-[0_14px_28px_rgba(143,85,37,0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[#8f5525]">{t.bilingualMenu}</p>
              <p className="mt-2 text-sm font-medium text-stone-600">
                {language === "fr"
                  ? "Le français est affiché par défaut. Appuyez pour passer en anglais."
                  : "English is active. Tap to switch to French."}
              </p>
            </div>
            <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-[#8f5525]">
              EN / FR
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="mt-4 inline-flex items-center gap-3 rounded-full border-2 border-[#b98549] bg-[#a5662b] px-5 py-3 text-lg font-black text-white shadow-sm transition-colors hover:bg-[#8f5525]"
          >
            <Languages className="h-5 w-5" />
            {language === "en" ? "FR" : "EN"}
          </button>
        </div>
      </div>
    </section>
  );
}
