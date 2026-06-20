"use client";

import { ChevronLeft, ChevronRight, MapPin, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { checkHomeDeliveryEligibility } from "@/lib/deliveryEligibility";
import {
  ALLOWED_DELIVERY_CITIES,
  DELIVERY_CITY_POSTCODES,
  extractAllowedCityFromAddress,
  getMockDeliverySuggestions,
  homeDeliveryDiscountPercent,
  matchAllowedCity,
  minimumOrderAmount,
  type AllowedDeliveryCity,
} from "@/lib/deliveryZones";
import { formatEuro, getDishName, getLocalizedCategoryLabel, getSpiceLabel, parsePrice, shouldShowSpiceLevel } from "@/lib/publicContent";
import type { AppSettings, Language, MenuItem, OrderConfirmationPayload, OrderType } from "@/lib/types";
import { PublicHeader } from "@/components/public/PublicHeader";

interface OrderPageProps {
  settings: AppSettings;
  menuItems: MenuItem[];
  cart: Record<string, number>;
  notes: Record<string, string>;
  language: Language;
  setLanguage: (language: Language) => void;
  onBack: () => void;
  onNoteChange: (itemId: string, value: string) => void;
  orderType: OrderType;
  backLabel?: string;
  onSubmitSuccess?: () => void;
  t: Record<string, string>;
}

type OrderDraft = {
  customerName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  selectedDeliveryCity: string;
  postcode: string;
  city: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  customerNotes: string;
};

function getOrderDraftStorageKey(orderType: OrderType) {
  return `tajmahal-order-draft-${orderType}`;
}

function readOrderDraft(orderType: OrderType): OrderDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getOrderDraftStorageKey(orderType));
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === "object" ? (parsed as OrderDraft) : null;
  } catch {
    return null;
  }
}

function saveOrderDraft(orderType: OrderType, draft: OrderDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getOrderDraftStorageKey(orderType), JSON.stringify(draft));
}

function clearOrderDraft(orderType: OrderType) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getOrderDraftStorageKey(orderType));
}

function getCartItems(menuItems: MenuItem[], cart: Record<string, number>) {
  return menuItems.filter((item) => Number(cart[item.id] || 0) > 0);
}

function getCartCount(cart: Record<string, number>) {
  return Object.values(cart).reduce((total, quantity) => total + Number(quantity || 0), 0);
}

function getCartTotal(menuItems: MenuItem[], cart: Record<string, number>) {
  return getCartItems(menuItems, cart).reduce(
    (total, item) => total + parsePrice(item.price) * Number(cart[item.id] || 0),
    0
  );
}

function buildDeliveryAddress(...parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

function extractPostcode(value: string) {
  const matched = value.match(/\b\d{5}\b/);
  return matched?.[0] ?? "";
}

function Field({
  label,
  help,
  required = false,
  children,
}: {
  label: string;
  help?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-base font-black text-stone-950">
        {label} {required ? <span>*</span> : null}
      </label>
      {children}
      {help ? <p className="mt-2 text-sm text-stone-600">{help}</p> : null}
    </div>
  );
}

function GuestCounter({
  guests,
  onChange,
}: {
  guests: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-stone-400 bg-white px-4 py-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, guests - 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 hover:bg-stone-50"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-2xl font-bold text-stone-950">{guests}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, guests + 1))}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 hover:bg-stone-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Calendar({
  language,
  selectedDate,
  onChange,
}: {
  language: Language;
  selectedDate: string;
  onChange: (value: string) => void;
}) {
  const todayInFrance = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const currentYear = todayInFrance.getFullYear();
  const currentMonth = todayInFrance.getMonth();
  const currentDay = todayInFrance.getDate();
  const monthNames =
    language === "en"
      ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      : ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
  const dayNames = language === "en" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;
  const blanks = Array.from({ length: mondayOffset }, (_, index) => `blank-${index}`);
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <div className="mt-5 rounded-2xl border border-stone-300 bg-stone-50 p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setMonth((value) => {
              if (value === 0) {
                setYear((current) => current - 1);
                return 11;
              }
              return value - 1;
            })
          }
          className="rounded-full border border-stone-300 p-2 hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-black text-stone-800">
          {monthNames[month]} {year}
        </p>
        <button
          type="button"
          onClick={() =>
            setMonth((value) => {
              if (value === 11) {
                setYear((current) => current + 1);
                return 0;
              }
              return value + 1;
            })
          }
          className="rounded-full border border-stone-300 p-2 hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500">
        {dayNames.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {blanks.map((blank) => <span key={blank} />)}
        {days.map((day) => {
          const dateValue = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const selected = selectedDate === dateValue;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onChange(dateValue)}
              className={`aspect-square rounded-xl text-sm font-bold transition-colors duration-150 ${
                selected ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-800 hover:bg-stone-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeSlotSelect({
  language,
  selectedTime,
  onChange,
}: {
  language: Language;
  selectedTime: string;
  onChange: (value: string) => void;
}) {
  const lunchSlots = ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"];
  const dinnerSlots = ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
  const franceTime = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const [hour, minute] = franceTime.split(":").map(Number);
  const minutesNow = hour * 60 + minute;
  const isLunchTime = minutesNow >= 11 * 60 && minutesNow <= 14 * 60 + 20;
  const isDinnerTime = minutesNow >= 18 * 60 + 30 && minutesNow <= 23 * 60 + 30;

  const renderSlots = (slots: string[], title: string, active: boolean) => (
    <div className="mt-5 first:mt-0">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black text-stone-700">{title}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"}`}>
          {active ? (language === "en" ? "Open Now" : "Ouvert") : language === "en" ? "Later" : "Plus tard"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => onChange(time)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
              selectedTime === time
                ? "border-stone-900 bg-stone-900 text-white"
                : active
                  ? "border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                  : "border-stone-200 bg-stone-100 text-stone-500"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-stone-300 bg-stone-50 p-4">
      {renderSlots(lunchSlots, language === "en" ? "Lunch: 11:00 - 14:20" : "Dejeuner : 11:00 - 14:20", isLunchTime)}
      {renderSlots(dinnerSlots, language === "en" ? "Dinner: 18:30 - 23:30" : "Diner : 18:30 - 23:30", isDinnerTime)}
    </div>
  );
}

function AddressSearch({
  selectedCity,
  label,
  placeholder,
  help,
  value,
  onChange,
  onSuggestionSelect,
}: {
  selectedCity: string;
  label: string;
  placeholder: string;
  help?: string;
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (value: string) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const [googleReady, setGoogleReady] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const autocompleteServiceRef = useRef<any>(null);

  useEffect(() => {
    if (!apiKey) return;

    const existingGoogle = (window as Window & { google?: any }).google;

    if (existingGoogle?.maps?.places) {
      setGoogleReady(true);
      return;
    }

    const handleLoad = () => setGoogleReady(true);
    const existingScript = document.getElementById("google-maps-places-script");

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.id = "google-maps-places-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, [apiKey]);

  useEffect(() => {
    const googleObject = (window as Window & { google?: any }).google;

    if (googleReady && googleObject?.maps?.places && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new googleObject.maps.places.AutocompleteService();
    }
  }, [googleReady]);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const matchedSelectedCity = selectedCity ? matchAllowedCity(selectedCity) : undefined;

    const timeoutId = window.setTimeout(() => {
      const googleObject = (window as Window & { google?: any }).google;
      const autocompleteService = autocompleteServiceRef.current;

      if (googleReady && googleObject?.maps?.places && autocompleteService) {
        autocompleteService.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: "fr" },
            types: ["address"],
          },
          (
            predictions: Array<{ description: string }> | null,
            status: string,
          ) => {
            if (
              status !== googleObject.maps.places.PlacesServiceStatus.OK ||
              !predictions
            ) {
              setSuggestions(getMockDeliverySuggestions(value, selectedCity));
              return;
            }

            const filteredPredictions = predictions
              .map((prediction) => prediction.description)
              .filter((description) => {
                const matchedCity = extractAllowedCityFromAddress(description);
                if (!matchedCity) return false;
                return matchedSelectedCity ? matchedCity === matchedSelectedCity : true;
              })
              .slice(0, 6);

            setSuggestions(
              filteredPredictions.length > 0
                ? filteredPredictions
                : getMockDeliverySuggestions(value, selectedCity),
            );
          },
        );

        return;
      }

      setSuggestions(getMockDeliverySuggestions(value, selectedCity));
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [googleReady, selectedCity, value]);

  return (
    <div className="grid gap-5 md:col-span-2">
      <Field label={label} required help={help}>
        <div className="relative">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-2xl border border-stone-400 bg-white px-4 py-3 text-lg outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300"
            placeholder={placeholder}
          />
          {value && suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-xl border border-stone-300 bg-white shadow-lg">
              {suggestions.map((place) => (
                <button
                  key={place}
                  type="button"
                  onClick={() => onSuggestionSelect(place)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-base text-stone-900 hover:bg-stone-50"
                >
                  <MapPin className="h-4 w-4 text-stone-400" />
                  {place}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </Field>
    </div>
  );
}

function DeliveryCityPicker({
  selectedCity,
  onSelect,
  t,
}: {
  selectedCity: string;
  onSelect: (city: AllowedDeliveryCity) => void;
  t: Record<string, string>;
}) {
  return (
    <div className="md:col-span-2">
      <Field label={t.deliveredCities} help={t.deliveredCitiesHelp} required>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ALLOWED_DELIVERY_CITIES.map((city) => {
            const selected = selectedCity === city;

            return (
              <button
                key={city}
                type="button"
                onClick={() => onSelect(city)}
                className={`rounded-2xl border px-4 py-4 text-left text-base font-bold transition-colors duration-150 ${
                  selected
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                }`}
              >
                <span className="block">{city}</span>
                <span className={`mt-1 block text-sm font-medium ${selected ? "text-stone-200" : "text-stone-500"}`}>
                  {DELIVERY_CITY_POSTCODES[city]}
                </span>
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

function CartSummary({
  settings,
  menuItems,
  cart,
  notes,
  onNoteChange,
  language,
  orderType,
  deliveryEligibility,
  t,
}: {
  settings: AppSettings;
  menuItems: MenuItem[];
  cart: Record<string, number>;
  notes: Record<string, string>;
  onNoteChange: (itemId: string, value: string) => void;
  language: Language;
  orderType: OrderType;
  deliveryEligibility: ReturnType<typeof checkHomeDeliveryEligibility>;
  t: Record<string, string>;
}) {
  const items = getCartItems(menuItems, cart);
  const subtotal = getCartTotal(menuItems, cart);
  const isEligibleHomeDelivery =
    orderType === "home_delivery" && deliveryEligibility.eligible;
  const total = isEligibleHomeDelivery ? deliveryEligibility.finalTotal : subtotal;

  if (items.length === 0) {
    return <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">{t.emptyCart}</div>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-stone-950">{t.selectedItems}</h3>
            <p className="mt-1 text-sm text-stone-600">
              {items.length} {t.items} · {getCartCount(cart)} {t.qty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{t.estimatedTotal}</p>
            <p className="text-2xl font-black text-stone-950">{formatEuro(total)}</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-stone-100">
        {items.map((item) => {
          const quantity = Number(cart[item.id] || 0);
          const unitPrice = parsePrice(item.price);
          const subtotal = unitPrice * quantity;

          return (
            <div key={item.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_80px_180px_100px_120px] md:items-center">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={getDishName(item, language)} className="h-14 w-14 rounded-2xl object-cover" />
                <div>
                  <p className="font-black text-stone-900">{getDishName(item, language)}</p>
                  <p className="text-xs text-stone-500">
                    {getLocalizedCategoryLabel(settings, item.category, language)}
                    {shouldShowSpiceLevel(item) ? ` · ${getSpiceLabel(item.spice_level, language)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm md:block md:text-center">
                <span className="font-bold text-stone-500 md:hidden">{t.qty}</span>
                <span className="font-black text-stone-900">x{quantity}</span>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500 md:hidden">{t.itemNote}</label>
                <input
                  value={notes[item.id] || ""}
                  onChange={(event) => onNoteChange(item.id, event.target.value)}
                  placeholder={t.itemNotePlaceholder}
                  className="h-11 w-full rounded-full border border-stone-300 bg-stone-50 px-4 text-sm text-stone-900 outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300"
                />
              </div>
              <div className="flex justify-between text-sm md:block md:text-right">
                <span className="font-bold text-stone-500 md:hidden">{t.price}</span>
                <span className="font-semibold text-stone-700">{formatEuro(unitPrice)}</span>
              </div>
              <div className="flex justify-between text-sm md:block md:text-right">
                <span className="font-bold text-stone-500 md:hidden">{t.subtotal}</span>
                <span className="font-black text-stone-950">{formatEuro(subtotal)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-stone-200 bg-stone-50 px-5 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold text-stone-700">
            <span>{t.subtotal}</span>
            <span>{formatEuro(subtotal)}</span>
          </div>
          {isEligibleHomeDelivery ? (
            <div className="flex items-center justify-between text-sm font-semibold text-emerald-700">
              <span>
                {t.homeDeliveryDiscount} ({homeDeliveryDiscountPercent}%)
              </span>
              <span>-{formatEuro(deliveryEligibility.discountAmount)}</span>
            </div>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-black text-stone-950">
            {isEligibleHomeDelivery ? t.finalTotalAfterDiscount : t.total}
          </span>
          <span className="text-2xl font-black text-stone-950">{formatEuro(total)}</span>
        </div>
        <p className="mt-2 text-xs text-stone-500">{t.serviceNote}</p>
      </div>
    </div>
  );
}

function DeliveryEligibilityCard({
  eligibility,
  hasAddressInput,
  t,
}: {
  eligibility: ReturnType<typeof checkHomeDeliveryEligibility>;
  hasAddressInput: boolean;
  t: Record<string, string>;
}) {
  if (!hasAddressInput) return null;

  const statusMessage = eligibility.eligible
    ? t.homeDeliveryEligibleMessage
    : eligibility.cartTotal < eligibility.minimumOrderAmount
      ? t.homeDeliveryMinimumOrderMessage
      : t.homeDeliveryLocationMessage;
  const statusTitle = eligibility.eligible
    ? t.homeDeliveryAvailable
    : eligibility.cartTotal < eligibility.minimumOrderAmount
      ? t.minimumHomeDeliveryOrder
      : t.deliveryAvailableOnly;

  const statusClassName = eligibility.eligible
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <div className={`rounded-2xl border px-5 py-4 ${statusClassName} md:col-span-2`}>
      <p className="text-base font-black">{statusTitle}</p>
      <p className="mt-2 text-sm leading-6">{statusMessage}</p>
      {eligibility.eligible ? (
        <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-200 bg-white/80 p-4 text-sm text-stone-800 md:grid-cols-3">
          <div>
            <p className="font-bold text-stone-500">{t.subtotal}</p>
            <p className="mt-1 text-lg font-black text-stone-950">
              {formatEuro(eligibility.cartTotal)}
            </p>
          </div>
          <div>
            <p className="font-bold text-stone-500">
              {t.homeDeliveryDiscountApplied}
            </p>
            <p className="mt-1 text-lg font-black text-emerald-700">
              -{formatEuro(eligibility.discountAmount)}
            </p>
          </div>
          <div>
            <p className="font-bold text-stone-500">{t.finalTotalAfterDiscount}</p>
            <p className="mt-1 text-lg font-black text-stone-950">
              {formatEuro(eligibility.finalTotal)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PublicOrderPage({
  settings,
  menuItems,
  cart,
  notes,
  language,
  setLanguage,
  onBack,
  onNoteChange,
  orderType,
  backLabel,
  onSubmitSuccess,
  t,
}: OrderPageProps) {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [selectedDeliveryCity, setSelectedDeliveryCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
  const [date, setDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  );
  const [timeSlot, setTimeSlot] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasRestoredDraftRef = useRef(false);
  const isDineIn = orderType === "dine_in";
  const selectedOption =
    orderType === "dine_in" ? t.dineIn : orderType === "takeaway" ? t.takeAway : t.homeDelivery;
  const emailLabel = isDineIn ? t.emailForReservation : t.emailForReceipt;
  const emailHelp = isDineIn ? t.reservationHelp : t.receiptHelp;
  const submitLabel = isDineIn ? t.sendReservationConfirmation : t.sendConfirmation;
  const cartItems = useMemo(() => getCartItems(menuItems, cart), [menuItems, cart]);
  const cartTotal = useMemo(() => getCartTotal(menuItems, cart), [menuItems, cart]);
  const deliveryAddress = useMemo(
    () =>
      buildDeliveryAddress(
        addressLine1,
        addressLine2,
        city || selectedDeliveryCity,
        postcode,
      ),
    [addressLine1, addressLine2, city, postcode, selectedDeliveryCity],
  );
  const deliveryEligibility = useMemo(
    () =>
      checkHomeDeliveryEligibility({
        address: deliveryAddress,
        cartTotal,
      }),
    [cartTotal, deliveryAddress],
  );
  const hasDeliveryAddressInput = Boolean(addressLine1.trim());
  const canSubmitHomeDelivery =
    addressLine1.trim().length > 0 && deliveryEligibility.eligible;
  const canSubmit = isDineIn
    ? true
    : orderType === "home_delivery"
      ? cartItems.length > 0 && canSubmitHomeDelivery
      : cartItems.length > 0;
  const needsMenuSelection = !isDineIn && cartItems.length === 0;
  const submitSuccessMessage =
    language === "fr"
      ? orderType === "dine_in"
        ? "✅ Votre réservation sur place a bien été envoyée. Un e-mail de confirmation a été transmis au client et au restaurant."
        : orderType === "takeaway"
          ? "✅ Votre commande à emporter a bien été envoyée. Un e-mail de confirmation a été transmis au client et au restaurant."
          : "✅ Votre commande en livraison a bien été envoyée. Un e-mail de confirmation a été transmis au client et au restaurant."
      : orderType === "dine_in"
        ? "✅ Your dine-in reservation has been sent successfully. Confirmation emails were sent to the customer and the restaurant."
        : orderType === "takeaway"
        ? "✅ Your takeaway order has been sent successfully. Confirmation emails were sent to the customer and the restaurant."
          : "✅ Your delivery order has been sent successfully. Confirmation emails were sent to the customer and the restaurant.";

  useEffect(() => {
    const draft = readOrderDraft(orderType);
    hasRestoredDraftRef.current = true;

    if (!draft) return;

    setCustomerName(draft.customerName || "");
    setPhoneNumber(draft.phoneNumber || "");
    setEmail(draft.email || "");
    setAddressLine1(draft.addressLine1 || "");
    setAddressLine2(draft.addressLine2 || "");
    setSelectedDeliveryCity(draft.selectedDeliveryCity || "");
    setPostcode(draft.postcode || "");
    setCity(draft.city || "");
    setGuestCount(typeof draft.guestCount === "number" ? draft.guestCount : 2);
    setDate(draft.date || date);
    setTimeSlot(draft.timeSlot || "");
    setCustomerNotes(draft.customerNotes || "");
  }, [orderType]);

  useEffect(() => {
    if (!hasRestoredDraftRef.current) return;

    saveOrderDraft(orderType, {
      customerName,
      phoneNumber,
      email,
      addressLine1,
      addressLine2,
      selectedDeliveryCity,
      postcode,
      city,
      guestCount,
      date,
      timeSlot,
      customerNotes,
    });
  }, [
    addressLine1,
    addressLine2,
    city,
    customerName,
    customerNotes,
    date,
    email,
    guestCount,
    orderType,
    phoneNumber,
    postcode,
    selectedDeliveryCity,
    timeSlot,
  ]);

  function syncDeliveryLocation(nextAddress: string, nextSelectedCity?: string) {
    const matchedCityFromAddress = extractAllowedCityFromAddress(nextAddress);
    const fallbackCity =
      nextAddress.includes(",") || extractPostcode(nextAddress)
        ? undefined
        : matchAllowedCity(nextSelectedCity || selectedDeliveryCity || city);
    const matchedCity = matchedCityFromAddress || fallbackCity;

    if (!matchedCity) {
      setSelectedDeliveryCity("");
      setCity("");
      setPostcode("");
      return;
    }

    setSelectedDeliveryCity(matchedCity);
    setCity(matchedCity);
    setPostcode(extractPostcode(nextAddress) || DELIVERY_CITY_POSTCODES[matchedCity]);
  }

  function handleAddressInput(nextAddress: string) {
    setAddressLine1(nextAddress);
    syncDeliveryLocation(nextAddress);
  }

  function handleDeliveryCitySelection(nextCity: AllowedDeliveryCity) {
    setSelectedDeliveryCity(nextCity);
    setCity(nextCity);
    setPostcode(DELIVERY_CITY_POSTCODES[nextCity]);
    syncDeliveryLocation(addressLine1, nextCity);
  }

  async function submitOrder() {
    setSubmitError("");
    setSubmitSuccess("");

    if (!customerName.trim() || !phoneNumber.trim() || !email.trim()) {
      setSubmitError(language === "fr" ? "Veuillez remplir tous les champs obligatoires." : "Please complete all required fields.");
      return;
    }

    if ((orderType === "dine_in" || orderType === "takeaway") && !timeSlot.trim()) {
      setSubmitError(language === "fr" ? "Veuillez remplir tous les champs obligatoires." : "Please complete all required fields.");
      return;
    }

    if (orderType === "home_delivery" && !addressLine1.trim()) {
      setSubmitError(language === "fr" ? "Veuillez saisir l'adresse de livraison." : "Please enter the delivery address.");
      return;
    }

    if (orderType === "home_delivery" && !selectedDeliveryCity.trim()) {
      setSubmitError(language === "fr" ? "Veuillez choisir une ville livrée." : "Please choose a supported delivery city.");
      return;
    }

    if (orderType === "home_delivery" && (!addressLine2.trim() || !postcode.trim() || !city.trim())) {
      setSubmitError(language === "fr" ? "Veuillez remplir tous les champs d'adresse obligatoires." : "Please complete all required address fields.");
      return;
    }

    if (orderType === "home_delivery" && !deliveryEligibility.eligible) {
      setSubmitError(
        deliveryEligibility.cartTotal < deliveryEligibility.minimumOrderAmount
          ? t.homeDeliveryMinimumOrderMessage
          : t.unsupportedDeliveryArea,
      );
      return;
    }

    if (!canSubmit) {
      setSubmitError(
        language === "fr"
          ? "Ajoutez des plats depuis le menu avant d'envoyer la confirmation."
          : "Add menu items from the menu before sending the confirmation."
      );
      return;
    }

    const payload: OrderConfirmationPayload = {
      language,
      orderType,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      postcode: postcode.trim(),
      city: city.trim(),
      guestCount,
      date,
      timeSlot: timeSlot.trim(),
      notes: customerNotes.trim(),
      items: cartItems.map((item) => ({
        itemId: item.id,
        quantity: Number(cart[item.id] || 0),
        note: notes[item.id] || "",
      })),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-order-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send confirmation.");
      }

      clearOrderDraft(orderType);
      setSubmitSuccess(submitSuccessMessage);
      onSubmitSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : language === "fr"
            ? "L'e-mail de confirmation n'a pas pu etre envoye."
            : "The confirmation email could not be sent."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="public-page-shell min-h-screen bg-[#f7f1e8]">
      <PublicHeader
        settings={settings}
        language={language}
        setLanguage={setLanguage}
        onBack={onBack}
        cartCount={getCartCount(cart)}
        showBack
        backLabel={backLabel}
        t={{
          openToday: t.openToday,
          backToMenu: t.backToMenu,
          cart: t.cart,
          dineIn: t.dineIn,
        }}
      />
      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-24 pb-10">
        <div className="animate-soft-rise overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1400&q=80"
            alt="Indian and Pakistani food table"
            className="h-56 w-full object-cover"
          />
        </div>
        <section className="animate-soft-rise mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8" style={{ animationDelay: "110ms" }}>
          <h2 className="text-2xl font-black text-stone-950">{selectedOption}</h2>
          <p className="mt-2 text-stone-600">{t.customerDetails}</p>
          {submitSuccess ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
              <p className="font-bold">{submitSuccess}</p>
            </div>
          ) : null}
          {submitError ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-800">
              {submitError}
            </div>
          ) : null}
          {needsMenuSelection ? (
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 md:flex-row md:items-center md:justify-between">
              <p className="font-medium">
                {language === "fr"
                  ? "Votre panier est vide. Choisissez vos plats sur le menu avant d'envoyer la commande."
                  : "Your cart is empty. Choose dishes from the menu before sending the order."}
              </p>
              <button
                type="button"
                onClick={onBack}
                className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-stone-800"
              >
                {language === "fr" ? "Retour au menu" : "Back to menu"}
              </button>
            </div>
          ) : null}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {cartItems.length > 0 ? (
              <div className="md:col-span-2">
                <CartSummary
                  settings={settings}
                  menuItems={menuItems}
                  cart={cart}
                  notes={notes}
                  onNoteChange={onNoteChange}
                  language={language}
                  orderType={orderType}
                  deliveryEligibility={deliveryEligibility}
                  t={t}
                />
              </div>
            ) : null}
            <Field label={t.customerName} required>
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className="w-full rounded-2xl border border-stone-400 bg-white px-4 py-3 text-lg outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300"
                placeholder="Alex Martin"
              />
            </Field>
            <Field label={t.phoneNumber} required help={t.phoneHelp}>
              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="w-full rounded-2xl border border-stone-400 bg-white px-4 py-3 text-lg outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300"
                placeholder={settings.publicSite.phoneNumber}
              />
            </Field>
            {orderType === "home_delivery" ? (
              <>
                <DeliveryCityPicker
                  selectedCity={selectedDeliveryCity}
                  onSelect={handleDeliveryCitySelection}
                  t={t}
                />
                <AddressSearch
                  selectedCity={selectedDeliveryCity}
                  label={t.deliveryAddress}
                  placeholder={t.addressLine1Placeholder}
                  help={t.addressAutocompleteHelp}
                  value={addressLine1}
                  onChange={handleAddressInput}
                  onSuggestionSelect={handleAddressInput}
                />
                <Field label={t.addressLine2} required>
                  <input
                    value={addressLine2}
                    onChange={(event) => setAddressLine2(event.target.value)}
                    className="w-full rounded-2xl border border-stone-400 bg-white px-4 py-3 text-lg outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300 md:col-span-2"
                    placeholder={t.addressLine2Placeholder}
                  />
                </Field>
                <div className="grid gap-4 md:col-span-2 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
                  <Field label={t.postcode} required>
                    <input
                      value={postcode}
                      readOnly
                      className="w-full rounded-2xl border border-stone-400 bg-stone-50 px-4 py-3 text-lg text-stone-700 outline-none"
                      placeholder={t.postcodePlaceholder}
                    />
                  </Field>
                  <Field label={t.city} required>
                    <input
                      value={city}
                      readOnly
                      className="w-full rounded-2xl border border-stone-400 bg-stone-50 px-4 py-3 text-lg text-stone-700 outline-none"
                      placeholder={t.cityPlaceholder}
                    />
                  </Field>
                </div>
                <DeliveryEligibilityCard
                  eligibility={deliveryEligibility}
                  hasAddressInput={hasDeliveryAddressInput}
                  t={t}
                />
              </>
            ) : null}
            {orderType === "dine_in" || orderType === "takeaway" ? (
              <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                {orderType === "dine_in" ? (
                  <Field label={t.guestsTime} required>
                    <GuestCounter guests={guestCount} onChange={setGuestCount} />
                    <Calendar language={language} selectedDate={date} onChange={setDate} />
                  </Field>
                ) : null}
                <Field label={t.timeSlot} required>
                  <TimeSlotSelect language={language} selectedTime={timeSlot} onChange={setTimeSlot} />
                </Field>
              </div>
            ) : null}
            <textarea
              value={customerNotes}
              onChange={(event) => setCustomerNotes(event.target.value)}
              className="min-h-28 rounded-2xl border border-stone-400 bg-white px-4 py-3 text-lg outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300 md:col-span-2"
              placeholder={t.notes}
            />
            <div className="md:col-span-2">
              <Field label={emailLabel} help={emailHelp}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-base outline-none focus:border-stone-700 focus:ring-2 focus:ring-stone-300"
                  placeholder={t.emailPlaceholder}
                />
              </Field>
            </div>
          </div>
          <button
            type="button"
            onClick={submitOrder}
            disabled={isSubmitting || needsMenuSelection || !canSubmit}
            className="mt-6 rounded-full bg-stone-900 px-8 py-3 font-bold text-white transition-colors duration-150 hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {isSubmitting ? t.sending : submitLabel}
          </button>
        </section>
      </main>
    </div>
  );
}
