export const RESTAURANT_LOCATION = {
  address: "1001 Av. Jean Marchand, 06270 Villeneuve-Loubet, France",
  lat: 43.6284,
  lng: 7.1232,
} as const;

export const ALLOWED_DELIVERY_CITIES = [
  "Villeneuve-Loubet",
  "Antibes",
  "Biot",
  "Cagnes-sur-Mer",
] as const;

export const DELIVERY_MAX_RADIUS_KM = 15;
export const DELIVERY_MINIMUM_ORDER_AMOUNT = 50 as const;

function normalizeAddress(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "'")
    .trim()
    .toLowerCase();
}

export function isSupportedDeliveryAddress(...parts: string[]) {
  const normalizedAddress = normalizeAddress(parts.filter(Boolean).join(" "));

  return ALLOWED_DELIVERY_CITIES.some((city) =>
    normalizedAddress.includes(normalizeAddress(city)),
  );
}
