export const CUSTOMER_ORDER_NUMBER_START = 10_000;

/**
 * Formats the immutable, customer-facing number assigned to an order.
 * Database IDs remain internal and are never used as a customer reference.
 */
export function formatCustomerOrderNumber(customerOrderNumber: number): string {
  if (
    !Number.isSafeInteger(customerOrderNumber) ||
    customerOrderNumber <= CUSTOMER_ORDER_NUMBER_START
  ) {
    throw new Error("Customer order numbers must be sequential values above 10000.");
  }

  return `Order #${customerOrderNumber}`;
}
