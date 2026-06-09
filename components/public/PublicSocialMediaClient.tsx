"use client";

import Link from "next/link";
import {
  Camera,
  ExternalLink,
  Globe,
  MapPinned,
  MenuSquare,
  MessageCircleHeart,
  Phone,
  Star,
  Video,
} from "lucide-react";
import { useEffect } from "react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { socialLinks } from "@/data/socialLinks";
import { initializeStore, saveLanguage, useLanguage, useSettings } from "@/lib/menuStore";
import { translations } from "@/lib/publicContent";

const socialPageCopy = {
  en: {
    eyebrow: "Social Media",
    title: "Stay Connected with Taj Mahal Marina",
    subtitle:
      "Scan, explore, review, and follow the restaurant in one place before or after your meal.",
    menuTitle: "See the Menu",
    menuDescription: "Open the full delivery and takeaway menu.",
    reviewTitle: "Leave a Google Review",
    reviewDescription: "Share your experience with a quick public review.",
    socialsTitle: "Follow Our Social Pages",
    socialsDescription:
      "Find the restaurant's latest updates, dishes, atmosphere, and news across every channel.",
    linksTitle: "Quick Links",
    linksDescription: "Useful shortcuts for guests at the table.",
    openMenu: "Open Menu",
    leaveReview: "Open Reviews",
    website: "Website",
    call: "Call Restaurant",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    addressLabel: "Visit us",
    socialHint: "Update the final social URLs in data/socialLinks.ts when the restaurant accounts are ready.",
  },
  fr: {
    eyebrow: "Réseaux sociaux",
    title: "Restez connecté avec Taj Mahal Marina",
    subtitle:
      "Scannez, consultez, notez et suivez le restaurant depuis une seule page avant ou après votre repas.",
    menuTitle: "Voir la carte",
    menuDescription: "Ouvrez la carte complète pour la livraison et le retrait.",
    reviewTitle: "Laisser un avis Google",
    reviewDescription: "Partagez votre expérience avec un avis public rapide.",
    socialsTitle: "Suivez nos réseaux",
    socialsDescription:
      "Retrouvez les nouveautés du restaurant, les plats, l'ambiance et les actualités sur chaque canal.",
    linksTitle: "Liens rapides",
    linksDescription: "Raccourcis utiles pour les clients à table.",
    openMenu: "Ouvrir la carte",
    leaveReview: "Ouvrir les avis",
    website: "Site web",
    call: "Appeler le restaurant",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    addressLabel: "Nous trouver",
    socialHint:
      "Remplacez les liens sociaux définitifs dans data/socialLinks.ts dès que les comptes du restaurant sont prêts.",
  },
} as const;

function SocialCard({
  href,
  label,
  description,
  icon: Icon,
  accent = false,
  compact = false,
}: {
  href: string;
  label: string;
  description: string;
  icon: typeof Globe;
  accent?: boolean;
  compact?: boolean;
}) {
  const isInternal = href.startsWith("/");

  const content = (
    <span
      className={`card-subtle-motion flex flex-col rounded-[1.35rem] border shadow-[0_10px_24px_rgba(86,56,31,0.07)] ${
        accent
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white/90 text-stone-900"
      } ${compact ? "min-h-[112px] p-4" : "min-h-[128px] p-4 sm:min-h-[140px] sm:p-5"}`}
    >
      <span
        className={`flex items-center justify-center rounded-2xl ${
          accent ? "bg-white/10 text-white" : "bg-stone-100 text-stone-700"
        } ${compact ? "h-10 w-10" : "h-11 w-11 sm:h-12 sm:w-12"}`}
      >
        <Icon className={compact ? "h-5 w-5" : "h-5 w-5 sm:h-6 sm:w-6"} />
      </span>
      <span className={`font-display font-semibold leading-none ${compact ? "mt-3 text-[1.18rem]" : "mt-3 text-[1.25rem] sm:mt-4 sm:text-[1.45rem]"}`}>
        {label}
      </span>
      <span className={`mt-2 text-sm leading-5 ${accent ? "text-stone-200" : "text-stone-600"} ${compact ? "line-clamp-2" : ""}`}>
        {description}
      </span>
      <span className={`mt-3 inline-flex items-center gap-2 text-sm font-bold ${accent ? "text-white" : "text-stone-800"}`}>
        <ExternalLink className="h-4 w-4" />
        {label}
      </span>
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
  }, []);

  const t = translations[language];
  const copy = socialPageCopy[language];

  return (
    <div className="public-page-shell landing-ornament-shell min-h-screen bg-[#f7f1e8] text-stone-900">
      <PublicHeader
        settings={settings}
        language={language}
        setLanguage={saveLanguage}
        cartCount={0}
        onBack={() => {}}
        t={t}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-3 pb-8 pt-5 sm:px-5 sm:pb-12 sm:pt-8">
        <section className="landing-hero-sheen overflow-hidden rounded-[1.55rem] border border-[var(--page-line)] px-4 py-5 shadow-[0_14px_32px_rgba(86,56,31,0.08)] sm:rounded-[1.9rem] sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-stone-500 sm:text-sm sm:tracking-[0.38em]">{copy.eyebrow}</p>
              <h2 className="font-display mt-2 text-[2rem] font-semibold leading-[0.94] text-stone-950 sm:mt-3 sm:text-[3rem] lg:text-[3.6rem]">
                {copy.title}
              </h2>
              <p className="mt-3 max-w-2xl text-[14px] leading-6 text-stone-600 sm:mt-4 sm:text-base sm:leading-7">
                {copy.subtitle}
              </p>
            </div>

            <div className="grid gap-2 text-sm text-stone-600 sm:grid-cols-2 lg:max-w-md">
              <div className="rounded-2xl border border-stone-200 bg-white/85 px-3 py-3 sm:px-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500 sm:text-xs sm:tracking-[0.28em]">{copy.addressLabel}</p>
                <p className="mt-1.5 leading-5 sm:mt-2 sm:leading-6">{settings.publicSite.restaurantAddress}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white/85 px-3 py-3 sm:px-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500 sm:text-xs sm:tracking-[0.28em]">{t.openToday}</p>
                <p className="mt-1.5 leading-5 sm:mt-2 sm:leading-6">{settings.publicSite.openingHours}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr]">
          <SocialCard
            href={socialLinks.menu}
            label={copy.menuTitle}
            description={copy.menuDescription}
            icon={MenuSquare}
            accent
            compact
          />
          <SocialCard
            href={socialLinks.googleReviews}
            label={copy.reviewTitle}
            description={copy.reviewDescription}
            icon={Star}
            compact
          />
        </section>

        <section className="mt-6">
          <div className="mb-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-stone-500 sm:text-sm sm:tracking-[0.38em]">{copy.socialsTitle}</p>
            <h3 className="font-display mt-1.5 text-[1.5rem] font-semibold text-stone-950 sm:mt-2 sm:text-[1.9rem]">{copy.socialsDescription}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <SocialCard
              href={socialLinks.instagram}
              label={copy.instagram}
              description={language === "fr" ? "Photos des plats, ambiance et nouveautés du restaurant." : "Dish photos, atmosphere, and restaurant highlights."}
              icon={Camera}
              compact
            />
            <SocialCard
              href={socialLinks.facebook}
              label={copy.facebook}
              description={language === "fr" ? "Actualités, événements et publications du restaurant." : "News, events, and restaurant updates."}
              icon={MessageCircleHeart}
              compact
            />
            <SocialCard
              href={socialLinks.tiktok}
              label={copy.tiktok}
              description={language === "fr" ? "Vidéos courtes, cuisine et moments en salle." : "Short videos, kitchen moments, and dining room scenes."}
              icon={Video}
              compact
            />
          </div>
        </section>

        <section className="mt-6 rounded-[1.5rem] border border-stone-200 bg-white/88 p-4 shadow-[0_12px_28px_rgba(86,56,31,0.06)] sm:rounded-[1.8rem] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-stone-500 sm:text-sm sm:tracking-[0.38em]">{copy.linksTitle}</p>
              <h3 className="font-display mt-1.5 text-[1.45rem] font-semibold text-stone-950 sm:mt-2 sm:text-[1.8rem]">{copy.linksDescription}</h3>
              <p className="mt-2 text-xs leading-5 text-stone-500 sm:mt-3 sm:text-sm sm:leading-6">{copy.socialHint}</p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-2xl">
              <SocialCard
                href={socialLinks.mainSite}
                label={copy.website}
                description={language === "fr" ? "Retour à la page d'accueil du restaurant." : "Return to the main restaurant landing page."}
                icon={Globe}
                compact
              />
              <SocialCard
                href={socialLinks.call}
                label={copy.call}
                description={settings.publicSite.phoneNumber}
                icon={Phone}
                compact
              />
              <SocialCard
                href={socialLinks.googleReviews}
                label={language === "fr" ? "Google Avis" : "Google Reviews"}
                description={language === "fr" ? "Ouvrir la page d'avis du restaurant." : "Open the restaurant review page."}
                icon={MapPinned}
                compact
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
