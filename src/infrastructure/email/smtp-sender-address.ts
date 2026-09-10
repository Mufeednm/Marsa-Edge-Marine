import "server-only";

const WEBSITE_EMAIL_SENDER_NAME = "Marsa Edge Marine";

/**
 * Keeps the authenticated sales mailbox while presenting a recognizable
 * customer-facing sender name in every website email.
 */
export function formatWebsiteSenderAddress(emailAddress: string): string {
  return `${WEBSITE_EMAIL_SENDER_NAME} <${emailAddress}>`;
}
