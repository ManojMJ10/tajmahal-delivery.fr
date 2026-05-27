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
    heroLabel: "Authentic Indian Menu",
    startOrder: "Start Order",
    ourDishes: "Our Dishes",
    showing: "Showing",
    items: "items",
    search: "Search dishes...",
    allergens: "Allergens",
    backToMenu: "Back to Menu",
    order: "Order",
    orderQuestion: "How would you like to order?",
    orderIntro:
      "Choose dine in, takeaway, or home delivery, then receive a polished confirmation email with your full order details.",
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
    heroLabel: "Menu Indien Authentique",
    startOrder: "Commander",
    ourDishes: "Nos plats",
    showing: "Affichage de",
    items: "plats",
    search: "Rechercher un plat...",
    allergens: "Allergenes",
    backToMenu: "Retour au menu",
    order: "Commande",
    orderQuestion: "Comment souhaitez-vous commander ?",
    orderIntro:
      "Choisissez sur place, a emporter ou livraison a domicile, puis recevez un e-mail de confirmation complet et soigne.",
    dineIn: "Sur Place",
    takeAway: "A Emporter",
    homeDelivery: "Livraison a Domicile",
    customerDetails: "Saisissez les informations client pour continuer.",
    customerName: "Nom complet (prenom et nom)",
    phoneNumber: "Numero de telephone",
    phoneHelp: "Peut etre utilise pour faciliter la livraison ou la reservation",
    deliveryAddress: "Adresse ligne 1",
    addressLine1Placeholder: "Adresse de rue",
    addressLine2: "Adresse ligne 2",
    addressLine2Placeholder: "Appartement, etage, batiment, societe (optionnel)",
    guestsTime: "Nombre de personnes",
    timeSlot: "Creneau horaire",
    notes: "Notes, allergies, demandes speciales",
    emailForUpdates: "E-mail",
    emailForReceipt: "E-mail pour le recu",
    emailForReservation: "E-mail pour la reservation",
    emailPlaceholder: "nom@exemple.com",
    continue: "Continuer",
    sendConfirmation: "Passer la commande",
    sending: "Commande en cours...",
    addToCart: "Ajouter au panier",
    cart: "Panier",
    emptyCart: "Votre panier est vide. Ajoutez des plats depuis le menu avant de continuer.",
    selectedItems: "Resume de commande",
    item: "Article",
    qty: "Qte",
    price: "Prix",
    subtotal: "Sous-total",
    total: "Total",
    estimatedTotal: "Total estime",
    serviceNote:
      "Le total final peut changer si le restaurant confirme des articles indisponibles ou des demandes speciales.",
    receiptHelp: "Recevez le recu de cette commande.",
    reservationHelp: "Recevez les details de reservation par e-mail.",
    addNote: "Ajouter une note",
    editNote: "Modifier la note",
    itemNotePlaceholder: "Ajouter une note pour ce plat...",
    itemNote: "Note",
    vegetarian: "Vegetarien",
    nonVeg: "Non vegetarien",
    drink: "Boisson",
    setMenu: "Menu",
    mild: "Doux",
    medium: "Moyen",
    hot: "Epicé",
    veryHot: "Tres epice",
    categories: "Categories",
    currentCategory: "Categorie actuelle",
    availableNow: "Disponible maintenant",
    bilingualMenu: "Menu bilingue",
    english: "Anglais",
    french: "Francais",
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
