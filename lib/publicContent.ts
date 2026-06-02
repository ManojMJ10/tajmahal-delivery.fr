import type { AppSettings, Language, MenuItem } from "@/lib/types";

const DRINK_CATEGORY_IDS = new Set([
  "aperitifs-alcohols",
  "beers",
  "soft-drinks",
  "red-wines",
  "rose-wines",
  "white-wines",
  "champagnes",
  "italian-sparkling",
  "pitchers",
]);

const SET_MENU_CATEGORY_IDS = new Set(["tasting-menu", "lunch-menu", "children-menu"]);

export const translations = {
  en: {
    openToday: "Open today",
    heroLabel: "Marina Signature",
    startOrder: "Start Order",
    ourDishes: "Discover the Menu",
    showing: "Showing",
    items: "items",
    search: "Search dishes...",
    allergens: "Allergens",
    backToMenu: "Back to Menu",
    order: "Order",
    orderQuestion: "How would you like to order?",
    orderIntro:
      "Choose dine in, takeaway, or home delivery, then receive a polished confirmation email with your full order details.",
    dineInQuestion: "Book your table with ease",
    dineInIntro:
      "Share your details to reserve a comfortable table and receive a clear confirmation for your visit at Taj Mahal Marina.",
    takeawayQuestion: "Prepare your takeaway order",
    takeawayIntro:
      "Confirm your collection details and receive a polished summary of the dishes prepared for pickup.",
    deliveryQuestion: "Arrange your home delivery",
    deliveryIntro:
      "Enter your delivery details to receive a complete confirmation for a fresh order sent to your address.",
    dineIn: "Dine In",
    takeAway: "Take Away",
    homeDelivery: "Home Delivery",
    customerDetails: "Enter customer details to continue.",
    customerName: "Full name (first name and surname)",
    phoneNumber: "Phone number",
    phoneHelp: "May be used to assist delivery or booking",
    deliveryAddress: "Address Line 1",
    addressLine1Placeholder: "Street address",
    addressLine2: "Address Line 2",
    addressLine2Placeholder: "Apt, suite, unit, company name (optional)",
    guestsTime: "Number of guests",
    timeSlot: "Time slot",
    notes: "Notes, allergies, special requests",
    emailForUpdates: "Email",
    emailForReceipt: "Email for receipt",
    emailForReservation: "Email for reservation details",
    emailPlaceholder: "name@example.com",
    continue: "Continue",
    sendConfirmation: "Place Order",
    sending: "Placing order...",
    addToCart: "Add to Cart",
    cart: "Cart",
    emptyCart: "Your cart is empty. Add dishes from the menu before continuing.",
    selectedItems: "Order Summary",
    item: "Item",
    qty: "Qty",
    price: "Price",
    subtotal: "Subtotal",
    total: "Total",
    estimatedTotal: "Estimated total",
    serviceNote:
      "Final total may change if the restaurant confirms unavailable items or special requests.",
    receiptHelp: "Get the receipt for this order.",
    reservationHelp: "Get your reservation details by email.",
    addNote: "Add note",
    editNote: "Edit note",
    itemNotePlaceholder: "Add a note for this dish...",
    itemNote: "Note",
    vegetarian: "Vegetarian",
    nonVeg: "Non-Veg",
    drink: "Drink",
    setMenu: "Menu",
    mild: "Mild",
    medium: "Medium",
    hot: "Hot",
    veryHot: "Very Hot",
    categories: "Categories",
    currentCategory: "Current Category",
    availableNow: "Available now",
    bilingualMenu: "Bilingual menu",
    english: "English",
    french: "Francais",
  },
  fr: {
    openToday: "Ouvert aujourd'hui",
    heroLabel: "Signature Marina",
    startOrder: "Commander",
    ourDishes: "Découvrir la carte",
    showing: "Affichage de",
    items: "plats",
    search: "Rechercher un plat...",
    allergens: "Allergènes",
    backToMenu: "Retour au menu",
    order: "Commande",
    orderQuestion: "Comment souhaitez-vous commander ?",
    orderIntro:
      "Choisissez sur place, à emporter ou en livraison à domicile, puis recevez un e-mail de confirmation complet et soigné.",
    dineInQuestion: "Réservez votre table en toute simplicité",
    dineInIntro:
      "Renseignez vos informations pour réserver une table confortable et recevoir une confirmation claire pour votre venue au Taj Mahal Marina.",
    takeawayQuestion: "Préparez votre commande à emporter",
    takeawayIntro:
      "Confirmez vos informations de retrait et recevez un récapitulatif soigné des plats préparés pour l'emporter.",
    deliveryQuestion: "Organisez votre livraison à domicile",
    deliveryIntro:
      "Saisissez vos coordonnées de livraison pour recevoir une confirmation complète d'une commande fraîche envoyée à votre adresse.",
    dineIn: "Sur place",
    takeAway: "À emporter",
    homeDelivery: "Livraison à domicile",
    customerDetails: "Saisissez les informations client pour continuer.",
    customerName: "Nom complet (prénom et nom)",
    phoneNumber: "Numéro de téléphone",
    phoneHelp: "Peut être utilisé pour faciliter la livraison ou la réservation",
    deliveryAddress: "Adresse ligne 1",
    addressLine1Placeholder: "Adresse de rue",
    addressLine2: "Adresse ligne 2",
    addressLine2Placeholder: "Appartement, étage, bâtiment, société (optionnel)",
    guestsTime: "Nombre de personnes",
    timeSlot: "Créneau horaire",
    notes: "Notes, allergies, demandes spéciales",
    emailForUpdates: "E-mail",
    emailForReceipt: "E-mail pour le reçu",
    emailForReservation: "E-mail pour la réservation",
    emailPlaceholder: "nom@exemple.com",
    continue: "Continuer",
    sendConfirmation: "Passer la commande",
    sending: "Commande en cours...",
    addToCart: "Ajouter au panier",
    cart: "Panier",
    emptyCart: "Votre panier est vide. Ajoutez des plats depuis le menu avant de continuer.",
    selectedItems: "Résumé de commande",
    item: "Article",
    qty: "Qté",
    price: "Prix",
    subtotal: "Sous-total",
    total: "Total",
    estimatedTotal: "Total estimé",
    serviceNote:
      "Le total final peut varier si le restaurant confirme des articles indisponibles ou des demandes spéciales.",
    receiptHelp: "Recevez le reçu de cette commande.",
    reservationHelp: "Recevez les détails de réservation par e-mail.",
    addNote: "Ajouter une note",
    editNote: "Modifier la note",
    itemNotePlaceholder: "Ajouter une note pour ce plat...",
    itemNote: "Note",
    vegetarian: "Végétarien",
    nonVeg: "Non végétarien",
    drink: "Boisson",
    setMenu: "Menu",
    mild: "Doux",
    medium: "Moyen",
    hot: "Épicé",
    veryHot: "Très épicé",
    categories: "Catégories",
    currentCategory: "Catégorie actuelle",
    availableNow: "Disponible maintenant",
    bilingualMenu: "Menu bilingue",
    english: "Anglais",
    french: "Français",
  },
} as const;

export function parsePrice(price: string) {
  return Number(String(price).replace("€", "").replace(",", ".").trim()) || 0;
}

export function formatEuro(amount: number) {
  return `€${amount.toFixed(2)}`;
}

export function getLocalizedCategoryLabel(
  settings: AppSettings,
  categoryId: string,
  language: Language
) {
  if (categoryId === "all") {
    return language === "en" ? "All" : "Tous";
  }

  const found = settings.categories.find((category) => category.id === categoryId);
  if (!found) return categoryId;
  return language === "en" ? found.label_en : found.label_fr;
}

export function getDishName(item: MenuItem, language: Language) {
  return language === "en" ? item.name_en : item.name_fr;
}

export function getDishDescription(item: MenuItem, language: Language) {
  return language === "en" ? item.description_en : item.description_fr;
}

export function getDishAllergens(item: MenuItem, language: Language) {
  return language === "en" ? item.allergens_en : item.allergens_fr;
}

export function isDrinkItem(item: MenuItem) {
  return DRINK_CATEGORY_IDS.has(item.category);
}

export function isSetMenuItem(item: MenuItem) {
  return SET_MENU_CATEGORY_IDS.has(item.category);
}

export function shouldShowSpiceLevel(item: MenuItem) {
  return !isDrinkItem(item) && !isSetMenuItem(item);
}

export function getSpiceLabel(level: number, language: Language) {
  const copy = translations[language];
  if (level <= 1) return copy.mild;
  if (level === 2) return copy.medium;
  if (level === 3) return copy.hot;
  return copy.veryHot;
}

export function getFoodTypeLabel(item: MenuItem, language: Language) {
  const copy = translations[language];
  if (isDrinkItem(item)) return copy.drink;
  if (isSetMenuItem(item)) return copy.setMenu;
  return item.food_type === "veg" ? copy.vegetarian : copy.nonVeg;
}
