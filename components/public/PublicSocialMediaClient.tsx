"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  MapPinned,
  MenuSquare,
  Music2,
  Star,
} from "lucide-react";
import { useEffect } from "react";
import { socialLinks } from "@/data/socialLinks";
import { initializeStore, saveLanguage, useLanguage, useSettings } from "@/lib/menuStore";

const socialPageCopy = {
  en: {
    title: "Taj Mahal Marina",
    subtitle: "Scan, tap, and explore.",
    menu: "Menu",
    directions: "Directions",
    reviews: "Google Reviews",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    switchLabel: "FR",
  },
  fr: {
    title: "Taj Mahal Marina",
    subtitle: "Scannez, touchez et explorez.",
    menu: "Carte",
    directions: "Itinéraire",
    reviews: "Avis Google",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    switchLabel: "EN",
  },
} as const;

function SocialButton({
  href,
  label,
  icon: Icon,
  accent = false,
}: {
  href: string;
  label: string;
  icon: typeof MenuSquare;
  accent?: boolean;
}) {
  const isInternal = href.startsWith("/");

  const content = (
    <span
      className={`flex min-h-[102px] flex-col items-center justify-center rounded-[1.35rem] border px-3 py-4 text-center shadow-[0_10px_24px_rgba(86,56,31,0.08)] transition-colors ${
        accent
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-900"
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          accent ? "bg-white/12 text-white" : "bg-stone-100 text-stone-800"
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span className="mt-2.5 text-[0.92rem] font-semibold leading-5">{label}</span>
    </span>
  );

  if (isInternal) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

export default function PublicSocialMediaClient() {
  const settings = useSettings();
  const language = useLanguage();

  useEffect(() => {
    initializeStore();
    saveLanguage("fr");
  }, []);

  const copy = socialPageCopy[language];

  return (
    <div className="landing-ornament-shell min-h-screen bg-[#f7f1e8] px-4 py-4 text-stone-900 sm:px-6">
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center">
        <div className="w-full rounded-[1.9rem] border border-[var(--page-line)] bg-white/94 p-4 shadow-[0_18px_40px_rgba(86,56,31,0.1)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="overflow-hidden rounded-[1rem] border border-stone-200 bg-white">
                <Image
                  src="/branding/taj-mahal-logo.jpg"
                  alt="Taj Mahal Marina"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-cover"
                />
              </div>
              <div>
                <h1 className="font-display text-[1.55rem] font-semibold leading-none text-stone-950">
                  {copy.title}
                </h1>
                <p className="mt-1.5 text-xs text-stone-500">{copy.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => saveLanguage(language === "fr" ? "en" : "fr")}
              className="rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-stone-700"
            >
              {copy.switchLabel}
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-[1.25rem]">
            <Image
              src="/restaurant/Taj_Mahal-02-1920w.png"
              alt="Taj Mahal Marina restaurant"
              width={960}
              height={600}
              className="h-24 w-full object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SocialButton href={socialLinks.menu} label={copy.menu} icon={MenuSquare} accent />
            <SocialButton href={socialLinks.directions} label={copy.directions} icon={MapPinned} />
            <SocialButton href={socialLinks.googleReviews} label={copy.reviews} icon={Star} />
            <SocialButton href={socialLinks.instagram} label={copy.instagram} icon={Instagram} />
            <SocialButton href={socialLinks.facebook} label={copy.facebook} icon={Facebook} />
            <SocialButton href={socialLinks.tiktok} label={copy.tiktok} icon={Music2} />
          </div>

          <p className="mt-4 text-center text-[12px] leading-5 text-stone-500">
            {settings.publicSite.restaurantAddress}
          </p>
        </div>
      </main>
    </div>
  );
}
