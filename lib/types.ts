export type Language = "en" | "fr";

export type FoodType = "veg" | "non-veg";

export type ThemeMode = "warm-dark" | "warm-light";

export interface LocalizedText {
  en: string;
  fr: string;
}

export interface Category {
  id: string;
  label_en: string;
  label_fr: string;
}

export interface MenuItem {
  id: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  category: string;
  price: string;
  image: string;
  spice_level: number;
  food_type: FoodType;
  allergens_en: string;
  allergens_fr: string;
  available: boolean;
  featured: boolean;
  show_on_kiosk: boolean;
  show_on_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicSiteSettings {
  phoneNumber: string;
  restaurantAddress: string;
  openingHours: string;
  deliveryMessage: string;
  takeawayMessage: string;
  dineInMessage: string;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
}

export interface KioskSettings {
  heading: string;
  subtitle: string;
  rotationSpeedMs: number;
  categoryRotationSpeedMs: number;
  showQrCode: boolean;
  qrCodeUrl: string;
  themeMode: ThemeMode;
  highlightCategory: boolean;
  showAllergens: boolean;
  showSpiceLevel: boolean;
}

export interface AppSettings {
  restaurantName: string;
  cuisineLabel: string;
  location: string;
  categories: Category[];
  publicSite: PublicSiteSettings;
  kiosk: KioskSettings;
  updatedAt: string;
}

export type OrderType = "dine_in" | "takeaway" | "home_delivery";

export interface OrderCartLine {
  itemId: string;
  quantity: number;
  note: string;
}

export interface OrderConfirmationPayload {
  language: Language;
  orderType: OrderType;
  customerName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  notes: string;
  items: OrderCartLine[];
}
