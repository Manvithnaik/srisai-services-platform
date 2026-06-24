/**
 * sendTelegramNotification
 *
 * Calls the server-side /api/telegram endpoint.
 * Errors are swallowed — Telegram failure must NEVER block the form submission.
 */

export interface TelegramNotificationData {
  referenceNumber: string;
  customerName: string;
  phoneNumber: string;
  serviceType: string;
  address: string;
  landmark?: string;
  description: string;
  latitude?: string;
  longitude?: string;
  mapsLink?: string;
  imageUrls: string;
  timestamp: string;
}

export async function sendTelegramNotification(data: TelegramNotificationData): Promise<void> {
  try {
    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.ok) {
      console.log('[Telegram] ✅ Notification sent. Message ID:', json.message_id);
    } else {
      console.warn('[Telegram] ⚠ Notification not sent:', json.reason ?? json.error);
    }
  } catch (err) {
    // Never throw — form submission must always succeed regardless of Telegram
    console.error('[Telegram] ❌ Failed to send notification:', err);
  }
}
