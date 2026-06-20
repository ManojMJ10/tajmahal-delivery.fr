export const allowedCities = [
  "Villeneuve-Loubet",
  "Antibes",
  "Biot",
  "Cagnes-sur-Mer",
] as const;

export type AllowedDeliveryCity = (typeof allowedCities)[number];

export const cityAliases: Record<AllowedDeliveryCity, string[]> = {
  "Villeneuve-Loubet": ["Villeneuve-Loubet", "Villeneuve Loubet"],
  Antibes: ["Antibes"],
  Biot: ["Biot"],
  "Cagnes-sur-Mer": ["Cagnes-sur-Mer", "Cagnes sur Mer"],
};

export const DELIVERY_CITY_POSTCODES: Record<AllowedDeliveryCity, string> = {
  "Villeneuve-Loubet": "06270",
  Antibes: "06600",
  Biot: "06410",
  "Cagnes-sur-Mer": "06800",
};

export const mockDeliveryAddressSuggestions = [
  "1001 Av. Jean Marchand, Villeneuve-Loubet, 06270",
  "15 Avenue de la Mer, Villeneuve-Loubet, 06270",
  "8 Allee des Bugadieres, Villeneuve-Loubet, 06270",
  "22 Route de Grasse, Villeneuve-Loubet, 06270",
  "4 Avenue des Rives, Villeneuve-Loubet, 06270",
  "12 Boulevard Albert 1er, Antibes, 06600",
  "6 Avenue Robert Soleau, Antibes, 06600",
  "18 Route de Valbonne, Biot, 06410",
  "4 Chemin des Combes, Biot, 06410",
  "9 Avenue de Nice, Cagnes-sur-Mer, 06800",
  "17 Boulevard Marechal Juin, Cagnes-sur-Mer, 06800",
] as const;

export const minimumOrderAmount = 50 as const;
export const homeDeliveryDiscountPercent = 5 as const;

export const ALLOWED_DELIVERY_CITIES = allowedCities;
export const DELIVERY_MINIMUM_ORDER_AMOUNT = minimumOrderAmount;

function normalizeValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "'")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function normalizeDeliveryZone(value: string) {
  return normalizeValue(value);
}

export function matchAllowedCity(value: string): AllowedDeliveryCity | undefined {
  const normalizedValue = normalizeValue(value);

  if (!normalizedValue) return undefined;

  return allowedCities.find((city) =>
    cityAliases[city].some((alias) => normalizeValue(alias) === normalizedValue),
  );
}

export function extractAllowedCityFromAddress(value: string): AllowedDeliveryCity | undefined {
  const normalizedValue = normalizeValue(value);

  if (!normalizedValue) return undefined;

  const aliasEntries = allowedCities.flatMap((city) =>
    cityAliases[city].map((alias) => ({
      city,
      alias,
      normalizedAlias: normalizeValue(alias),
    })),
  );

  aliasEntries.sort((left, right) => right.normalizedAlias.length - left.normalizedAlias.length);

  return aliasEntries.find((entry) => normalizedValue.includes(entry.normalizedAlias))?.city;
}

export function isAllowedDeliveryCity(value: string) {
  return Boolean(matchAllowedCity(value) || extractAllowedCityFromAddress(value));
}

export function isSupportedDeliveryAddress(...parts: string[]) {
  return Boolean(extractAllowedCityFromAddress(parts.filter(Boolean).join(" ")));
}

export function getMockDeliverySuggestions(query: string, preferredCity?: string) {
  const normalizedQuery = normalizeValue(query);
  const matchedPreferredCity = preferredCity ? matchAllowedCity(preferredCity) : undefined;

  return mockDeliveryAddressSuggestions.filter((suggestion) => {
    const matchedCity = extractAllowedCityFromAddress(suggestion);
    const matchesCity = matchedPreferredCity ? matchedCity === matchedPreferredCity : true;
    const matchesQuery = !normalizedQuery || normalizeValue(suggestion).includes(normalizedQuery);

    return matchesCity && matchesQuery;
  });
}
