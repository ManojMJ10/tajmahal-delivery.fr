import type { AppSettings } from "@/lib/types";

export const defaultSettings: AppSettings = {
  "restaurantName": "Taj Mahal",
  "cuisineLabel": "Indian & Pakistani Restaurant",
  "location": "Villeneuve-Loubet, France",
  "categories": [
    {
      "id": "all",
      "label_en": "All",
      "label_fr": "Tous"
    },
    {
      "id": "aperitifs-alcohols",
      "label_en": "Aperitifs & Alcohols",
      "label_fr": "Apéritifs & Alcools"
    },
    {
      "id": "beers",
      "label_en": "Beers",
      "label_fr": "Bières"
    },
    {
      "id": "soft-drinks",
      "label_en": "Soft Drinks",
      "label_fr": "Boissons fraîches"
    },
    {
      "id": "naan-breads",
      "label_en": "Naan Breads",
      "label_fr": "Pains naan"
    },
    {
      "id": "starters",
      "label_en": "Starters",
      "label_fr": "Entrées"
    },
    {
      "id": "chicken",
      "label_en": "Chicken",
      "label_fr": "Poulet"
    },
    {
      "id": "lamb",
      "label_en": "Lamb",
      "label_fr": "Agneau"
    },
    {
      "id": "beef",
      "label_en": "Beef",
      "label_fr": "Bœuf"
    },
    {
      "id": "sides",
      "label_en": "Sides",
      "label_fr": "Accompagnements"
    },
    {
      "id": "biryani",
      "label_en": "Biryani",
      "label_fr": "Biryani"
    },
    {
      "id": "seafood",
      "label_en": "Seafood",
      "label_fr": "Fruits de mer"
    },
    {
      "id": "tasting-menu",
      "label_en": "Tasting Menu",
      "label_fr": "Menu dégustation"
    },
    {
      "id": "lunch-menu",
      "label_en": "Lunch Menu",
      "label_fr": "Menu midi"
    },
    {
      "id": "children-menu",
      "label_en": "Children's Menu",
      "label_fr": "Menu enfant"
    },
    {
      "id": "red-wines",
      "label_en": "Red Wines",
      "label_fr": "Vins rouges"
    },
    {
      "id": "rose-wines",
      "label_en": "Rosé Wines",
      "label_fr": "Vins rosés"
    },
    {
      "id": "white-wines",
      "label_en": "White Wines",
      "label_fr": "Vins blancs"
    },
    {
      "id": "champagnes",
      "label_en": "Champagnes",
      "label_fr": "Champagnes"
    },
    {
      "id": "italian-sparkling",
      "label_en": "Italian Sparkling",
      "label_fr": "Bulles italiennes"
    },
    {
      "id": "pitchers",
      "label_en": "Pitchers",
      "label_fr": "Pichets"
    }
  ],
  "publicSite": {
    "phoneNumber": "04 93 73 07 87",
    "restaurantAddress": "The Marina, 1001 Battery Avenue, 06270 Villeneuve-Loubet",
    "openingHours": "Lunch 11:00 - 14:30, Dinner 18:30 - 23:00",
    "deliveryMessage": "Fresh delivery across Nice and nearby areas.",
    "takeawayMessage": "Quick collection with hot packing.",
    "dineInMessage": "Comfortable dining room for lunch and evening service.",
    "heroTitle": {
      "en": "Authentic Indian & Pakistani Menu",
      "fr": "Menu indien et pakistanais authentique"
    },
    "heroSubtitle": {
      "en": "Official restaurant menu from Taj Mahal in Nice.",
      "fr": "La carte officielle du restaurant Taj Mahal à Nice."
    }
  },
  "kiosk": {
    "heading": "Taj Mahal",
    "subtitle": "Indian & Pakistani Restaurant",
    "rotationSpeedMs": 6000,
    "categoryRotationSpeedMs": 10000,
    "showQrCode": true,
    "qrCodeUrl": "https://TajMahal-delivery.fr",
    "themeMode": "warm-dark",
    "highlightCategory": true,
    "showAllergens": true,
    "showSpiceLevel": true
  },
  "updatedAt": "2026-05-27T09:00:00.000Z"
};
