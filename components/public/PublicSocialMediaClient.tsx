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
}: {
  href: string;
  label: string;
  description: string;
  icon: typeof Globe;
  accent?: boolean;
}) {
  const isInternal = href.startsWith("/");

  const content = (
    <span
      className={`card-subtle-motion flex min-h-[150px] flex-col rounded-[1.6rem] border p-5 shadow-[0_14px_34px_rgba(86,56,31,0.08)] ${
        accent
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white/90 text-stone-900"
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          accent ? "bg-white/10 text-white" : "bg-stone-100 text-stone-700"
        }`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span className="font-display mt-4 text-[1.55rem] font-semibold leading-none">{label}</span>
      <span className={`mt-3 text-sm leading-6 ${accent ? "text-stone-200" : "text-stone-600"}`}>
        {description}
      </span>
      <span className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${accent ? "text-white" : "text-stone-800"}`}>
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

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-5 lg:pt-8">
        <section className="landing-hero-sheen overflow-hidden rounded-[1.9rem] border border-[var(--page-line)] px-6 py-7 shadow-[0_18px_44px_rgba(86,56,31,0.08)] sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.38em] text-stone-500">{copy.eyebrow}</p>
              <h2 className="font-display mt-3 text-[2.6rem] font-semibold leading-[0.94] text-stone-950 sm:text-[3.4rem] lg:text-[4rem]">
                {copy.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-stone-600 sm:text-base">
                {copy.subtitle}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-stone-600 sm:grid-cols-2 lg:max-w-md">
              <div className="rounded-2xl border border-stone-200 bg-white/85 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">{copy.addressLabel}</p>
                <p className="mt-2 leading-6">{settings.publicSite.restaurantAddress}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white/85 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-stone-500">{t.openToday}</p>
                <p className="mt-2 leading-6">{settings.publicSite.openingHours}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <SocialCard
            href={socialLinks.menu}
            label={copy.menuTitle}
            description={copy.menuDescription}
            icon={MenuSquare}
            accent
          />
          <SocialCard
            href={socialLinks.googleReviews}
            label={copy.reviewTitle}
            description={copy.reviewDescription}
            icon={Star}
          />
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-bold uppercase tracking-[0.38em] text-stone-500">{copy.socialsTitle}</p>
            <h3 className="font-display mt-2 text-[2rem] font-semibold text-stone-950">{copy.socialsDescription}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <SocialCard
              href={socialLinks.instagram}
              label={copy.instagram}
              description={language === "fr" ? "Photos des plats, ambiance et nouveautés du restaurant." : "Dish photos, atmosphere, and restaurant highlights."}
              icon={Camera}
            />
            <SocialCard
              href={socialLinks.facebook}
              label={copy.facebook}
              description={language === "fr" ? "Actualités, événements et publications du restaurant." : "News, events, and restaurant updates."}
              icon={MessageCircleHeart}
            />
            <SocialCard
              href={socialLinks.tiktok}
              label={copy.tiktok}
              description={language === "fr" ? "Vidéos courtes, cuisine et moments en salle." : "Short videos, kitchen moments, and dining room scenes."}
              icon={Video}
            />
          </div>
        </section>

        <section className="mt-8 rounded-[1.8rem] border border-stone-200 bg-white/88 p-6 shadow-[0_12px_28px_rgba(86,56,31,0.06)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.38em] text-stone-500">{copy.linksTitle}</p>
              <h3 className="font-display mt-2 text-[1.9rem] font-semibold text-stone-950">{copy.linksDescription}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-500">{copy.socialHint}</p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-2xl">
              <SocialCard
                href={socialLinks.mainSite}
                label={copy.website}
                description={language === "fr" ? "Retour à la page d'accueil du restaurant." : "Return to the main restaurant landing page."}
                icon={Globe}
              />
              <SocialCard
                href={socialLinks.call}
                label={copy.call}
                description={settings.publicSite.phoneNumber}
                icon={Phone}
              />
              <SocialCard
                href={socialLinks.googleReviews}
                label={language === "fr" ? "Google Avis" : "Google Reviews"}
                description={language === "fr" ? "Ouvrir la page d'avis du restaurant." : "Open the restaurant review page."}
                icon={MapPinned}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
