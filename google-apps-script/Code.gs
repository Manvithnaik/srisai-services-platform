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
 *  A: Timestamp          B: Reference Number   C: Customer Name
 *  D: Phone Number       E: Service Type       F: Address
 *  G: Landmark           H: Description        I: Latitude
 *  J: Longitude          K: Maps Link          L: Image URLs
 *  M: Status
 *
 * The sheet already auto-generates the clickable Maps link from
 * columns I and J — the script also writes it directly into K
 * so email and WhatsApp always have the correct URL.
 * ─────────────────────────────────────────────────────────────────
 * EMAILJS TEMPLATE VARIABLES (use these exact names):
 *  {{reference_number}}  {{customer_name}}     {{phone_number}}
 *  {{service_type}}      {{address}}           {{landmark}}
 *  {{description}}
 *  {{latitude}}          {{longitude}}         {{maps_link}}
 *  {{cloudinary_image_urls}}                   {{timestamp}}
 * ─────────────────────────────────────────────────────────────────
 * TELEGRAM:
 *  Bot token and group chat ID live ONLY here — never in frontend code.
 * ─────────────────────────────────────────────────────────────────
 */

// ── Google Sheet Config ────────────────────────────────────────────────────────
var SHEET_ID   = '1PKWBZlKiD1foXf5RcqlHkHgI7d6O3jyUHXSloUMQ16o';
var SHEET_NAME = 'Sheet1'; // change if your tab has a different name

// ── Telegram Config (server-side only — never expose to frontend) ─────────────
var TELEGRAM_BOT_TOKEN = '8408568924:AAEUSjJX1VyV-ODq2VbzGz0v-PYPmm27hZo';
var TELEGRAM_CHAT_ID   = '-1004363658543';

// ── Telegram Notification ──────────────────────────────────────────────────────
/**
 * Sends a formatted Telegram notification to the company group.
 * Called AFTER the row is successfully appended to Google Sheets.
 * Failure here is logged but does NOT block the success response.
 *
 * @param {Object} data - The parsed request payload from the customer form.
 */
function sendTelegramNotification(data) {
  try {
    console.log('[Telegram] Sending notification...');

    // Strip the "+91 " prefix for clean phone links
    var rawPhone = (data.phoneNumber || '').replace(/^\+91\s*/, '').replace(/\s/g, '');

    // Build the image URLs line
    var imageText = 'No images uploaded';
    if (data.imageUrls && data.imageUrls !== 'No images uploaded' && data.imageUrls.trim() !== '') {
      var urls = data.imageUrls.split('\n').map(function(u, i) { return (i + 1) + '. ' + u.trim(); });
      imageText = urls.join('\n');
    }

    // Maps link display
    var mapsDisplay = (data.mapsLink && data.mapsLink !== 'Not available')
      ? '[📍 Open in Google Maps](' + data.mapsLink + ')'
      : 'Not captured';

    var message =
      '🔧 *NEW SERVICE REQUEST*\n' +
      '━━━━━━━━━━━━━━━\n\n' +
      '📌 *Reference*\n`' + (data.referenceNumber || 'N/A') + '`\n\n' +
      '👤 *Customer*\n' + escapeMarkdown(data.customerName || 'N/A') + '\n\n' +
      '📞 *Phone*\n[+91 ' + rawPhone + '](tel:+91' + rawPhone + ')\n\n' +
      '🛠 *Service*\n' + escapeMarkdown(data.serviceType || 'N/A') + '\n\n' +
      '📍 *Address*\n' + escapeMarkdown(data.address || 'N/A') + '\n\n' +
      (data.landmark && data.landmark !== 'Not provided' ? '🏷 *Landmark*\n' + escapeMarkdown(data.landmark) + '\n\n' : '') +
      '🗺 *Location*\n' + mapsDisplay + '\n\n' +
      '📝 *Issue*\n' + escapeMarkdown(data.description || 'N/A') + '\n\n' +
      '🖼 *Images*\n' + imageText + '\n\n' +
      '⏰ *Submitted*\n' + (data.timestamp || 'N/A') + '\n\n' +
      '━━━━━━━━━━━━━━━\n\n' +
      '📞 [Call Customer](tel:+91' + rawPhone + ')   ' +
      '💬 [WhatsApp](https://wa.me/91' + rawPhone + ')';

    var url     = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
    var payload = JSON.stringify({
      chat_id:    TELEGRAM_CHAT_ID,
      text:       message,
      parse_mode: 'Markdown',
      disable_web_page_preview: false
    });

    var options = {
      method:      'post',
      contentType: 'application/json',
      payload:     payload,
      muteHttpExceptions: true   // get the error body instead of throwing
    };

    var response     = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    if (responseCode === 200) {
      console.log('[Telegram] Notification sent successfully. Response: ' + responseBody);
    } else {
      console.error('[Telegram] Failed to send notification. HTTP ' + responseCode + ': ' + responseBody);
    }

  } catch (err) {
    // Log but never throw — Telegram failure must not break the submission
    console.error('[Telegram] Failed to send notification. Error: ' + err.toString());
  }
}

/**
 * Escapes special Markdown characters that could break Telegram's parser.
 * Only escapes chars that are meaningful in Markdown mode (not MarkdownV2).
 */
function escapeMarkdown(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/`/g, '\\`')
    .replace(/\[/g, '\\[');
}

// ── Web App Entry Point ────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss    = SpreadsheetApp.openById(SHEET_ID);

    // Check if feedback request
    if (data.type === 'feedback') {
      var feedbackSheet = ss.getSheetByName('Feedback') || ss.insertSheet('Feedback');

      // Add header row if feedbackSheet is empty
      if (feedbackSheet.getLastRow() === 0) {
        feedbackSheet.appendRow([
          'Timestamp',
          'Name',
          'Email',
          'Rating',
          'Message',
          'Status'
        ]);

        // Format header row
        var headerRange = feedbackSheet.getRange(1, 1, 1, 6);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#34a853'); // Green header for feedback
        headerRange.setFontColor('#ffffff');
      }

      // Append feedback row
      feedbackSheet.appendRow([
        data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        data.name || '',
        data.email || '',
        data.rating || '',
        data.message || '',
        'Approved'
      ]);

      feedbackSheet.autoResizeColumns(1, 6);

      // Send Telegram notification for feedback
      sendTelegramFeedbackNotification(data);

      return ContentService
        .createTextOutput(JSON.stringify({ success: true, row: feedbackSheet.getLastRow() }))
        .setMimeType(ContentService.MimeType.JSON);
    }

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

    // Step 1 — Append the service request row to Google Sheets
    sheet.appendRow([
      data.timestamp       || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.referenceNumber || '',
      data.customerName    || '',
      data.phoneNumber     || '',
      data.serviceType     || '',
      data.address         || '',
      data.landmark        || '',
      data.description     || '',
      data.latitude        || '',
      data.longitude       || '',
      data.mapsLink        || '',
      data.imageUrls       || '',
      data.status          || 'New'
    ]);

    // Make the Maps Link cell clickable (last row, column K = 11)
    var lastRow = sheet.getLastRow();
    if (data.mapsLink && data.mapsLink !== 'Not available') {
      sheet.getRange(lastRow, 11).setFormula(
        '=HYPERLINK("' + data.mapsLink + '","View on Maps")'
      );
    }

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 13);

    // Step 2 — Send Telegram notification AFTER row is saved
    //          (failure here does NOT affect the success response)
    sendTelegramNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Handle CORS preflight OPTIONS requests ────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'Shree Devi Services CRM' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Sends a formatted Telegram notification for customer feedback.
 *
 * @param {Object} data - The parsed feedback payload.
 */
function sendTelegramFeedbackNotification(data) {
  try {
    var token = TELEGRAM_BOT_TOKEN;
    var chatId = TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    var stars = '';
    var ratingVal = parseInt(data.rating) || 5;
    for (var i = 0; i < 5; i++) {
      stars += i < ratingVal ? '⭐' : '☆';
    }

    var message =
      '📝 *NEW CUSTOMER FEEDBACK*\n' +
      '━━━━━━━━━━━━━━━\n\n' +
      '👤 *Name*\n' + escapeMarkdown(data.name || 'N/A') + '\n\n' +
      '📧 *Email*\n' + escapeMarkdown(data.email || 'N/A') + '\n\n' +
      '⭐ *Rating*\n' + stars + ' (' + ratingVal + '/5)\n\n' +
      '💬 *Feedback*\n' + escapeMarkdown(data.message || 'N/A') + '\n\n' +
      '━━━━━━━━━━━━━━━';

    var url     = 'https://api.telegram.org/bot' + token + '/sendMessage';
    var payload = JSON.stringify({
      chat_id:                  chatId,
      text:                     message,
      parse_mode:               'Markdown',
      disable_web_page_preview: true
    });

    var options = {
      method:             'post',
      contentType:        'application/json',
      payload:            payload,
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    console.log('[Telegram Feedback] Response: ' + response.getContentText());
  } catch (err) {
    console.error('[Telegram Feedback] Error: ' + err.toString());
  }
}
