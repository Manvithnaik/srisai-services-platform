/**
 * Google Sheets Submission Utility
 * POSTs service request data to a Google Apps Script Web App,
 * which appends a row to the Google Sheet.
 */

export type SheetRow = {
  timestamp: string;
  referenceNumber: string;
  customerName: string;
  phoneNumber: string;
  serviceType: string;
  address: string;
  landmark: string;
  description: string;
  latitude: string;
  longitude: string;
  mapsLink: string;
  imageUrls: string;
  status: string;
};

const SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

/**
 * Submit a service request record to Google Sheets via Apps Script.
 *
 * Technical note: Google Apps Script Web Apps do not support CORS preflight
 * (OPTIONS) requests. We must use mode:'no-cors' to skip the preflight.
 * With no-cors, the browser CANNOT include 'Content-Type: application/json'
 * because that is not a CORS-safe header. We send the body as plain text
 * (default for a string body in no-cors mode). Apps Script receives it in
 * e.postData.contents and can JSON.parse it regardless of content type.
 */
export async function submitToSheets(row: SheetRow): Promise<void> {
  if (!SHEETS_URL || SHEETS_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
    console.warn('[Sheets] NEXT_PUBLIC_GOOGLE_SHEETS_URL is not configured. Skipping.');
    return;
  }

  const payload = JSON.stringify(row);
  console.log('[Sheets] Sending row to Apps Script:', row.referenceNumber, '→', SHEETS_URL);
  console.log('[Sheets] Payload preview:', payload.slice(0, 200));

  // Retry up to 2 times on network failure
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
        // No Content-Type header → browser defaults to text/plain
        // → CORS-safe → no preflight → body is delivered to Apps Script ✓
      });
      console.log(`[Sheets] ✅ Request sent (attempt ${attempt}). Check your Sheet for the new row.`);
      return; // success — exit
    } catch (err) {
      console.error(`[Sheets] ❌ Network error on attempt ${attempt}:`, err);
      if (attempt === 2) {
        throw new Error(`Google Sheets submission failed after ${attempt} attempts: ${err}`);
      }
      // Wait 1s before retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
