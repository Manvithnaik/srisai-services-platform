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

    // Add status dropdown to the new row's Status cell (col M)
    setupStatusDropdown(sheet, lastRow);

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

// ── GET: feedback list OR complaint tracking ──────────────────────────────────
function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    var action = params.action || 'feedback';

    // ── Track a complaint by reference number ──
    if (action === 'track') {
      var ref = (params.ref || '').trim().toUpperCase();
      if (!ref) {
        return ContentService
          .createTextOutput(JSON.stringify({ success: false, error: 'No reference number provided.' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      var ss          = SpreadsheetApp.openById(SHEET_ID);
      var sheet       = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
      var lastRow     = sheet.getLastRow();

      if (lastRow < 2) {
        return ContentService
          .createTextOutput(JSON.stringify({ success: false, error: 'No records found.' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Sheet columns: A=Timestamp B=RefNum C=Name D=Phone E=Service
      //                F=Address G=Landmark H=Description I=Lat J=Lng K=Maps L=Images M=Status
      var data = sheet.getRange(2, 1, lastRow - 1, 13).getValues();
      for (var i = 0; i < data.length; i++) {
        var row    = data[i];
        var rowRef = String(row[1]).trim().toUpperCase();
        if (rowRef === ref) {
          return ContentService
            .createTextOutput(JSON.stringify({
              success         : true,
              referenceNumber : row[1]  || '',
              timestamp       : row[0]  ? String(row[0]) : '',
              customerName    : row[2]  || '',
              phoneNumber     : row[3]  || '',
              serviceType     : row[4]  || '',
              address         : row[5]  || '',
              landmark        : row[6]  || '',
              description     : row[7]  || '',
              latitude        : row[8]  || '',
              longitude       : row[9]  || '',
              mapsLink        : row[10] || '',
              imageUrls       : row[11] || '',
              status          : row[12] || 'New'
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }

      // Reference not found
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Reference number not found.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── Default: return approved feedback for homepage carousel ──
    var ss2    = SpreadsheetApp.openById(SHEET_ID);
    var fSheet = ss2.getSheetByName('Feedback');

    if (!fSheet || fSheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, feedback: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var numRows  = fSheet.getLastRow() - 1;
    var fData    = fSheet.getRange(2, 1, numRows, 6).getValues();
    var feedback = [];
    for (var j = 0; j < fData.length; j++) {
      var fr = fData[j];
      feedback.push({
        timestamp : fr[0] ? String(fr[0]) : '',
        name      : fr[1] ? String(fr[1]) : '',
        email     : fr[2] ? String(fr[2]) : '',
        rating    : fr[3] ? parseInt(fr[3]) || 5 : 5,
        message   : fr[4] ? String(fr[4]) : '',
        status    : fr[5] ? String(fr[5]) : 'Approved'
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, feedback: feedback }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString(), feedback: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Adds a dropdown validation (New / In Progress / Completed / Cancelled)
 * to the Status cell (column M) of a given row in Sheet1.
 * Call this every time a new service-request row is appended.
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The target sheet.
 * @param {number} rowIndex - 1-based row number of the newly added data row.
 */
function setupStatusDropdown(sheet, rowIndex) {
  try {
    var statusCell = sheet.getRange(rowIndex, 13); // column M
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'In Progress', 'Completed', 'Cancelled'], true)
      .setAllowInvalid(false)
      .build();
    statusCell.setDataValidation(rule);
    // Colour-code the cell based on current value
    var val = statusCell.getValue();
    var bg  = val === 'Completed'   ? '#c8e6c9'
            : val === 'In Progress' ? '#fff9c4'
            : val === 'Cancelled'   ? '#ffcdd2'
            :                        '#e3f2fd'; // New = light blue
    statusCell.setBackground(bg).setFontWeight('bold');
  } catch (err) {
    console.error('[Dropdown] Failed to set status dropdown: ' + err.toString());
  }
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
