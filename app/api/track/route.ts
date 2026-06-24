/**
 * GET /api/track?ref=SDS-xxx
 *
 * Server-side proxy: looks up a service request in Google Sheets
 * by reference number via the Apps Script doGet endpoint.
 * Never cached — always fetches fresh status.
 */

import { NextRequest, NextResponse } from 'next/server';

const SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')?.trim().toUpperCase();

  if (!ref) {
    return NextResponse.json({ success: false, error: 'No reference number provided.' }, { status: 400 });
  }

  if (!SHEETS_URL) {
    return NextResponse.json({ success: false, error: 'Tracking service not configured.' }, { status: 503 });
  }

  try {
    const url = `${SHEETS_URL}?action=track&ref=${encodeURIComponent(ref)}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Failed to reach tracking service.' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[Track API] Error:', err);
    return NextResponse.json({ success: false, error: 'Tracking service unavailable.' }, { status: 503 });
  }
}
