export const FREE_UAE_DELIVERY_THRESHOLD_AED_CENTS = 70_000;
export const UAE_DELIVERY_FEE_AED_CENTS = 3_500;

export function calculateUaeDeliveryFeeAedCents(subtotalAedCents: number): number {
  if (subtotalAedCents <= 0 || subtotalAedCents >= FREE_UAE_DELIVERY_THRESHOLD_AED_CENTS) {
    return 0;
  }

  return UAE_DELIVERY_FEE_AED_CENTS;
}
