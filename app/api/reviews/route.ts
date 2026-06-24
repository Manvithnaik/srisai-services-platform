/**
 * GET /api/reviews
 *
 * Server-side proxy that fetches customer feedback from the Google Apps Script
 * Web App (doGet) and returns it as JSON to the frontend.
 *
 * We do this server-side so:
 *  1. No CORS issues — the Apps Script URL is called from Node, not the browser.
 *  2. We can cache the result for 60 seconds to avoid hammering the script.
 */

import { NextResponse } from 'next/server';

const SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET() {
  if (!SHEETS_URL) {
    return NextResponse.json({ feedback: [] });
  }

  try {
    const res = await fetch(SHEETS_URL, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error('[Reviews API] Apps Script returned HTTP', res.status);
      return NextResponse.json({ feedback: [] });
    }

    const json = await res.json();

    if (!json.success || !Array.isArray(json.feedback)) {
      return NextResponse.json({ feedback: [] });
    }

    return NextResponse.json({ feedback: json.feedback });
  } catch (err) {
    console.error('[Reviews API] Failed to fetch from Apps Script:', err);
    return NextResponse.json({ feedback: [] });
  }
}
