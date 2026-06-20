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
    closedNowTitle: "Restaurant is currently closed",
    closedNowMessage:
      "Our kitchen opens daily from 11:30 am to 2:30 pm and again from 6:30 pm to 11:00 pm. You can still browse the menu or continue to the site.",
    seeMenu: "See menu",
    continueBrowsing: "Continue",
    deliveryNoticeTitle: "Home delivery information",
    deliveryNoticeMessage:
      "Home delivery is available in Villeneuve-Loubet, Antibes, Biot, and Cagnes-sur-Mer. A minimum order of €50 is required, and a 5% discount is applied to eligible delivery orders.",
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
    dineInQuestion: "Reserve your dine-in experience",
    dineInIntro:
      "Share your details to reserve your table at Taj Mahal Marina and receive a clear confirmation for your visit.",
    takeawayQuestion: "Confirm your takeaway pickup",
    takeawayIntro:
      "Enter your collection details and receive a complete confirmation for the dishes prepared to take away.",
    deliveryQuestion: "Schedule your home delivery",
    deliveryIntro:
      "Enter your delivery details and receive a complete confirmation for a fresh order sent directly to your address.",
    dineIn: "Dine In",
    takeAway: "Take Away",
    homeDelivery: "Home Delivery",
    customerDetails: "Enter customer details to continue.",
    customerName: "Full name (first name and surname)",
    phoneNumber: "Phone number",
    phoneHelp: "May be used to assist delivery or booking",
    deliveredCities: "Delivered cities",
    deliveredCitiesHelp: "Choose your delivery area before entering the address.",
    deliveryAddress: "Address Line 1",
    addressLine1Placeholder: "Street address",
    addressAutocompleteHelp:
      "Start typing your address. Suggestions are limited to Villeneuve-Loubet, Antibes, Biot, and Cagnes-sur-Mer.",
    addressLine2: "Address Line 2",
    addressLine2Placeholder: "Apt, suite, unit, company name",
    postcode: "Postcode",
    postcodePlaceholder: "06270",
    city: "City",
    cityPlaceholder: "Villeneuve-Loubet",
    guestsTime: "Number of guests",
    timeSlot: "Time slot",
    notes: "Notes, allergies, special requests",
    emailForUpdates: "Email",
    emailForReceipt: "Email for receipt",
    emailForReservation: "Email for reservation details",
    emailPlaceholder: "name@example.com",
    continue: "Continue",
    sendReservationConfirmation: "Reservation",
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
    homeDeliveryDiscount: "Home delivery discount",
    homeDeliveryAvailable: "Home delivery available",
    minimumHomeDeliveryOrder: "Minimum order for home delivery is €50",
    homeDeliveryDiscountApplied: "5% home delivery discount applied",
    deliveryAvailableOnly:
      "Delivery available only in Villeneuve-Loubet, Antibes, Biot, and Cagnes-sur-Mer",
    finalTotalAfterDiscount: "Final total after discount",
    homeDeliveryEligibleMessage:
      "Good news! Home delivery is available to your address. A 5% home delivery discount has been applied.",
    homeDeliveryMinimumOrderMessage:
      "Minimum order for home delivery is €50. Add more items to continue.",
    homeDeliveryLocationMessage:
      "Sorry, delivery is currently available only in Villeneuve-Loubet, Antibes, Biot, and Cagnes-sur-Mer.",
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
    unsupportedDeliveryArea:
      "Sorry, delivery is currently available only in Villeneuve-Loubet, Antibes, Biot, and Cagnes-sur-Mer.",
  },
  fr: {
    openToday: "Ouvert aujourd'hui",
    closedNowTitle: "Le restaurant est actuellement fermé",
    closedNowMessage:
      "Notre cuisine est ouverte tous les jours de 11h30 à 14h30 puis de 18h30 à 23h00. Vous pouvez quand même voir le menu ou continuer sur le site.",
    seeMenu: "Voir le menu",
    continueBrowsing: "Continuer",
    deliveryNoticeTitle: "Informations sur la livraison à domicile",
    deliveryNoticeMessage:
      "La livraison à domicile est disponible à Villeneuve-Loubet, Antibes, Biot et Cagnes-sur-Mer. Une commande minimum de 50 € est demandée, et une remise de 5 % s'applique aux commandes de livraison éligibles.",
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
    dineInQuestion: "Réservez votre expérience sur place",
    dineInIntro:
      "Renseignez vos informations pour réserver votre table au Taj Mahal Marina et recevoir une confirmation claire pour votre venue.",
    takeawayQuestion: "Confirmez votre retrait à emporter",
    takeawayIntro:
      "Indiquez vos informations de retrait et recevez une confirmation complète des plats préparés à emporter.",
    deliveryQuestion: "Programmez votre livraison à domicile",
    deliveryIntro:
      "Saisissez vos coordonnées de livraison et recevez une confirmation complète d'une commande fraîche envoyée directement à votre adresse.",
    dineIn: "Sur place",
    takeAway: "À emporter",
    homeDelivery: "Livraison à domicile",
    customerDetails: "Saisissez les informations client pour continuer.",
    customerName: "Nom complet (prénom et nom)",
    phoneNumber: "Numéro de téléphone",
    phoneHelp: "Peut être utilisé pour faciliter la livraison ou la réservation",
    deliveredCities: "Villes livrées",
    deliveredCitiesHelp: "Choisissez votre zone de livraison avant de saisir l'adresse.",
    deliveryAddress: "Adresse ligne 1",
    addressLine1Placeholder: "Adresse de rue",
    addressAutocompleteHelp:
      "Commencez à saisir votre adresse. Les suggestions sont limitées à Villeneuve-Loubet, Antibes, Biot et Cagnes-sur-Mer.",
    addressLine2: "Adresse ligne 2",
    addressLine2Placeholder: "Appartement, étage, bâtiment, société",
    postcode: "Code postal",
    postcodePlaceholder: "06270",
    city: "Ville",
    cityPlaceholder: "Villeneuve-Loubet",
    guestsTime: "Nombre de personnes",
    timeSlot: "Créneau horaire",
    notes: "Notes, allergies, demandes spéciales",
    emailForUpdates: "E-mail",
    emailForReceipt: "E-mail pour le reçu",
    emailForReservation: "E-mail pour la réservation",
    emailPlaceholder: "nom@exemple.com",
    continue: "Continuer",
    sendReservationConfirmation: "Réservation",
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
    homeDeliveryDiscount: "Remise livraison à domicile",
    homeDeliveryAvailable: "Livraison à domicile disponible",
    minimumHomeDeliveryOrder: "Commande minimum de 50€ pour la livraison à domicile",
    homeDeliveryDiscountApplied: "Remise de 5% appliquée pour la livraison à domicile",
    deliveryAvailableOnly:
      "Livraison disponible uniquement à Villeneuve-Loubet, Antibes, Biot et Cagnes-sur-Mer",
    finalTotalAfterDiscount: "Total final après remise",
    homeDeliveryEligibleMessage:
      "Bonne nouvelle ! La livraison à domicile est disponible à votre adresse. Une remise de 5 % pour la livraison à domicile a été appliquée.",
    homeDeliveryMinimumOrderMessage:
      "Commande minimum de 50€ pour la livraison à domicile. Ajoutez encore des articles pour continuer.",
    homeDeliveryLocationMessage:
      "Désolé, la livraison est actuellement disponible uniquement à Villeneuve-Loubet, Antibes, Biot et Cagnes-sur-Mer.",
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
    unsupportedDeliveryArea:
      "Désolé, la livraison est actuellement disponible uniquement à Villeneuve-Loubet, Antibes, Biot et Cagnes-sur-Mer.",
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
