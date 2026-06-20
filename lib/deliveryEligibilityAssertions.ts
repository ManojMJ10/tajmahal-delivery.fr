import { checkHomeDeliveryEligibility } from "./deliveryEligibility";

export function runDeliveryEligibilityAssertions() {
  const antibesForty = checkHomeDeliveryEligibility({
    address: "12 Boulevard Albert 1er, Antibes, 06600",
    cartTotal: 40,
  });
  console.assert(!antibesForty.eligible, "€40 + Antibes should not be eligible.");
  console.assert(antibesForty.discountAmount === 0, "€40 + Antibes should not get a discount.");

  const antibesFifty = checkHomeDeliveryEligibility({
    address: "12 Boulevard Albert 1er, Antibes, 06600",
    cartTotal: 50,
  });
  console.assert(antibesFifty.eligible, "€50 + Antibes should be eligible.");
  console.assert(antibesFifty.discountAmount === 2.5, "€50 + Antibes should discount €2.50.");
  console.assert(antibesFifty.finalTotal === 47.5, "€50 + Antibes should final at €47.50.");

  const biotSixty = checkHomeDeliveryEligibility({
    address: "18 Route de Valbonne, Biot, 06410",
    cartTotal: 60,
  });
  console.assert(biotSixty.eligible, "€60 + Biot should be eligible.");
  console.assert(biotSixty.finalTotal === 57, "€60 + Biot should final at €57.00.");

  const niceSixty = checkHomeDeliveryEligibility({
    address: "5 Rue de France, Nice, 06000",
    cartTotal: 60,
  });
  console.assert(!niceSixty.eligible, "€60 + Nice should not be eligible.");
  console.assert(niceSixty.discountAmount === 0, "€60 + Nice should not get a discount.");

  const cagnesSixty = checkHomeDeliveryEligibility({
    address: "9 Avenue de Nice, Cagnes sur Mer, 06800",
    cartTotal: 60,
  });
  console.assert(cagnesSixty.eligible, "€60 + Cagnes sur Mer should be eligible.");

  const villeneuveSixty = checkHomeDeliveryEligibility({
    address: "15 Avenue de la Mer, Villeneuve Loubet, 06270",
    cartTotal: 60,
  });
  console.assert(
    villeneuveSixty.eligible,
    "€60 + Villeneuve Loubet should be eligible.",
  );
}
