/**
 * Google Apps Script — Shree Devi Services CRM
 * ─────────────────────────────────────────────────────────────────
 * DEPLOY INSTRUCTIONS (takes ~2 minutes):
 *
 *  1. Open https://script.google.com → "New project"
 *  2. Delete the default myFunction() code
 *  3. Paste this entire file
 *  4. Click "Deploy" → "New deployment"
 *  5. Type: Web App
 *     Description: Shree Devi Services CRM v1
 *     Execute as: Me
 *     Who has access: Anyone
 *  6. Click "Deploy" → authorise permissions when prompted
 *  7. Copy the Web App URL
 *  8. Paste it into .env.local as NEXT_PUBLIC_GOOGLE_SHEETS_URL
 *
 * ─────────────────────────────────────────────────────────────────
 * SHEET COLUMNS (must match exactly — in order):
 *  A: Timestamp
 *  B: Reference Number
 *  C: Customer Name
 *  D: Phone Number
 *  E: Service Type
 *  F: Address
 *  G: Landmark
 *  H: Description
 *  I: Latitude
 *  J: Longitude
 *  K: Maps Link
 *  L: Image URLs
 *  M: Status
 *
 * The sheet already auto-generates the clickable Maps link from
 * columns I and J — the script also writes it directly into K
 * so email and WhatsApp always have the correct URL.
 * ─────────────────────────────────────────────────────────────────
 * EMAILJS TEMPLATE VARIABLES (use these exact names):
 *  {{reference_number}}  {{customer_name}}     {{phone_number}}
 *  {{service_type}}      {{address}}           {{landmark}}
 *  {{preferred_time}}    {{description}}
 *  {{latitude}}          {{longitude}}         {{maps_link}}
 *  {{cloudinary_image_urls}}                   {{timestamp}}
 * ─────────────────────────────────────────────────────────────────
 */

const SHEET_ID = '1PKWBZlKiD1foXf5RcqlHkHgI7d6O3jyUHXSloUMQ16o';
const SHEET_NAME = 'Sheet1'; // change if your tab has a different name

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Reference Number',
        'Customer Name',
        'Phone Number',
        'Service Type',
        'Address',
        'Landmark',
        'Description',
        'Latitude',
        'Longitude',
        'Maps Link',
        'Image URLs',
        'Status'
      ]);

      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a73e8');
      headerRange.setFontColor('#ffffff');
    }

    // Append the service request row
    sheet.appendRow([
      data.timestamp         || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.referenceNumber   || '',
      data.customerName      || '',
      data.phoneNumber       || '',
      data.serviceType       || '',
      data.address           || '',
      data.landmark          || '',
      data.description       || '',
      data.latitude          || '',
      data.longitude         || '',
      data.mapsLink          || '',
      data.imageUrls         || '',
      data.status            || 'New'
    ]);

    // Make the Maps Link cell clickable (last row, column K = 11)
    var lastRow = sheet.getLastRow();
    if (data.mapsLink) {
      sheet.getRange(lastRow, 11).setFormula(
        '=HYPERLINK("' + data.mapsLink + '","View on Maps")'
      );
    }

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 13);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight OPTIONS requests
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'Shree Devi Services CRM' }))
    .setMimeType(ContentService.MimeType.JSON);
}
