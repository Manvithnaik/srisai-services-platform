/**
 * POST /api/telegram
 *
 * Server-side proxy for Telegram Bot API notifications.
 * The bot token is read from TELEGRAM_BOT_TOKEN (no NEXT_PUBLIC_ prefix)
 * so it is NEVER included in the browser bundle.
 *
 * Called by the form submit handler alongside EmailJS.
 * Even if this endpoint fails, the form submission is not affected —
 * the caller swallows errors gracefully.
 */

import { NextRequest, NextResponse } from 'next/server';

export interface TelegramPayload {
  referenceNumber: string;
  customerName: string;
  phoneNumber: string;    // already formatted, e.g. "+91 9876543210"
  serviceType: string;
  address: string;
  landmark?: string;
  description: string;
  latitude?: string;
  longitude?: string;
  mapsLink?: string;
  imageUrls: string;      // newline-separated URLs or "No images uploaded"
  timestamp: string;
}

function escapeMarkdown(text: string): string {
  return (text || '')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/`/g, '\\`')
    .replace(/\[/g, '\\[');
}

function buildMessage(d: TelegramPayload): string {
  // Strip "+91 " for clean tel: / wa.me links
  const rawPhone = d.phoneNumber.replace(/^\+91\s*/, '').replace(/\s/g, '');

  // Format image list
  let imageText = 'No images uploaded';
  if (d.imageUrls && d.imageUrls !== 'No images uploaded' && d.imageUrls.trim() !== '') {
    imageText = d.imageUrls
      .split('\n')
      .map((u, i) => `${i + 1}. ${u.trim()}`)
      .join('\n');
  }

  // Maps link
  const mapsDisplay =
    d.mapsLink && d.mapsLink !== 'Not available'
      ? `[📍 Open in Google Maps](${d.mapsLink})`
      : 'Not captured';

  const landmarkLine =
    d.landmark && d.landmark !== 'Not provided'
      ? `🏷 *Landmark*\n${escapeMarkdown(d.landmark)}\n\n`
      : '';

  return (
    `🔧 *NEW SERVICE REQUEST*\n` +
    `━━━━━━━━━━━━━━━\n\n` +
    `📌 *Reference*\n\`${d.referenceNumber || 'N/A'}\`\n\n` +
    `👤 *Customer*\n${escapeMarkdown(d.customerName)}\n\n` +
    `📞 *Phone*\n[+91 ${rawPhone}](tel:+91${rawPhone})\n\n` +
    `🛠 *Service*\n${escapeMarkdown(d.serviceType)}\n\n` +
    `📍 *Address*\n${escapeMarkdown(d.address)}\n\n` +
    landmarkLine +
    `🗺 *Location*\n${mapsDisplay}\n\n` +
    `📝 *Issue*\n${escapeMarkdown(d.description)}\n\n` +
    `🖼 *Images*\n${imageText}\n\n` +
    `⏰ *Submitted*\n${d.timestamp}\n\n` +
    `━━━━━━━━━━━━━━━\n\n` +
    `📞 [Call Customer](tel:+91${rawPhone})   💬 [WhatsApp](https://wa.me/91${rawPhone})`
  );
}

export async function POST(req: NextRequest) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('[Telegram] Bot token or chat ID not configured — skipping.');
    return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 200 });
  }

  let payload: TelegramPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_json' }, { status: 400 });
  }

  const message = buildMessage(payload);

  console.log('[Telegram] Sending notification for', payload.referenceNumber, '...');

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:                  chatId,
          text:                     message,
          parse_mode:               'Markdown',
          disable_web_page_preview: false,
        }),
      }
    );

    const json = await res.json();

    if (res.ok && json.ok) {
      console.log('[Telegram] Notification sent successfully. Message ID:', json.result?.message_id);
      return NextResponse.json({ ok: true, message_id: json.result?.message_id });
    } else {
      console.error('[Telegram] Failed to send notification. Telegram error:', json);
      return NextResponse.json({ ok: false, error: json }, { status: 200 }); // 200 so caller doesn't throw
    }
  } catch (err) {
    console.error('[Telegram] Failed to send notification. Network error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 200 }); // swallow for caller
  }
}
