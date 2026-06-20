import {
  extractAllowedCityFromAddress,
  homeDeliveryDiscountPercent,
  minimumOrderAmount,
} from "./deliveryZones";

export interface HomeDeliveryEligibilityInput {
  address: string;
  cartTotal: number;
}

export interface HomeDeliveryEligibilityResult {
  eligible: boolean;
  reason: string;
  matchedCity?: string;
  minimumOrderAmount: number;
  cartTotal: number;
  discountPercent: number;
  discountAmount: number;
  finalTotal: number;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function checkHomeDeliveryEligibility({
  address,
  cartTotal,
}: HomeDeliveryEligibilityInput): HomeDeliveryEligibilityResult {
  const roundedCartTotal = roundCurrency(cartTotal);

  if (roundedCartTotal < minimumOrderAmount) {
    return {
      eligible: false,
      reason: "Minimum order for home delivery is €50.",
      minimumOrderAmount,
      cartTotal: roundedCartTotal,
      discountPercent: homeDeliveryDiscountPercent,
      discountAmount: 0,
      finalTotal: roundedCartTotal,
    };
  }

  const matchedCity = extractAllowedCityFromAddress(address);

  if (!matchedCity) {
    return {
      eligible: false,
      reason:
        "Sorry, delivery is currently available only in Villeneuve-Loubet, Antibes, Biot, and Cagnes-sur-Mer.",
      minimumOrderAmount,
      cartTotal: roundedCartTotal,
      discountPercent: homeDeliveryDiscountPercent,
      discountAmount: 0,
      finalTotal: roundedCartTotal,
    };
  }

  const discountAmount = roundCurrency(
    roundedCartTotal * (homeDeliveryDiscountPercent / 100),
  );
  const finalTotal = roundCurrency(roundedCartTotal - discountAmount);

  return {
    eligible: true,
    reason: "Good news! Home delivery is available and 5% discount has been applied.",
    matchedCity,
    minimumOrderAmount,
    cartTotal: roundedCartTotal,
    discountPercent: homeDeliveryDiscountPercent,
    discountAmount,
    finalTotal,
  };
}
