# 🛠️ Shree Devi / Sri Sai Services Platform

A high-performance, modern Next.js maintenance and service booking portal. Designed for local maintenance experts (Electricians, Plumbers, and Technicians) in Udupi, Karnataka, this platform automates booking submissions, tracks issues, manages client feedback, and includes a full admin CRM dashboard.

---

## 🚀 Key Features

### 🌐 Public Services Portal
- **Services Showcase:** Dedicated showcases for Electricians, Plumbers, and Technicians.
- **Visual Gallery:** A photo gallery of completed works and recent service projects.
- **Interactive Booking Form:** Dynamic multi-step request workflow with:
  - **Geolocation integration** (auto-detects customer's current latitude and longitude).
  - **Direct Image upload** for capturing problems on-site.
  - **Real-time reference number generation** for tracking.
- **Status Tracking:** Customers can track the real-time status of their complaints using their unique reference number.
- **Feedback System:** Allows users to leave reviews and testimonials.

### 📊 CRM & Administration Dashboard
- **Dashboard Overview:** Displays key stats (Total Complaints, Open complaints, Feedback, and Gallery Images count).
- **Complaint Management:** Access details for all service requests, review maps locations, inspect problem pictures, and update status.
- **Feedback Moderator:** Approve or delete user reviews/testimonials.
- **Gallery Manager:** Upload, edit, and organize project photos.
- **Settings configuration:** Customize portal options directly from the panel.

### 🔗 Integrations & Hybrid Architecture
- **Google Sheets Database:** Submits bookings to a Google Sheets document via an Apps Script Web App.
- **Cloudinary Storage:** Securely processes client photo uploads directly via unsigned client-side presets.
- **EmailJS Integration:** Sends automated email alerts to administrators with ticket details.
- **WhatsApp Support:** Instantly bridges customers to WhatsApp support with pre-filled templates.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```
├── app/                       # Next.js pages and layouts
│   ├── (auth)/                # Authentication routing (Login / Register)
│   ├── (public)/              # Public-facing views (Services, Feedback, Geolocation booking, Tracking)
│   └── admin/                 # CRM administration views (Complaints tracker, stats, settings)
├── components/                # Modular UI components
│   ├── admin/                 # Administrative components (Stats, header, sidebar, tables)
│   ├── auth/                  # Authentication forms
│   ├── public/                # Public view modules
│   └── ui/                    # Reusable design system primitives
├── google-apps-script/        # Google Apps Script code for Google Sheets CRM
│   └── Code.gs                # Apps Script code
├── lib/                       # Utility helpers & shared state hooks
│   ├── api/                   # Axios API client handlers
│   ├── context/               # React Context Providers (AuthContext)
│   ├── hooks/                 # Reusable React hooks
│   ├── schemas/               # Form validation schemas
│   └── sheets.ts              # Sheets integration utility
└── public/                    # Assets and media images
```

---

## ⚙️ Configuration & Setup

### 1. Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory. Configure the following variables:

```bash
# ── Cloudinary (unsigned uploads) ─────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name

# ── EmailJS Credentials ────────────────────────────────────────
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# ── Google Sheets Apps Script Web App ─────────────────────────
NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/.../exec

# ── Backend API URL (If utilizing a backend database) ─────────
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

### 2. Google Sheets & Apps Script Setup

To set up the Google Sheets integration:
1. Open a Google Sheet and copy its **Spreadsheet ID** (from the URL).
2. Go to [Google Apps Script](https://script.google.com/).
3. Create a **New project**.
4. Paste the content of [google-apps-script/Code.gs](file:///c:/Users/manvi/OneDrive/Documents/sri-sai-services-website/google-apps-script/Code.gs) into the editor.
5. Replace `SHEET_ID` inside the code with your Spreadsheet ID:
   ```javascript
   const SHEET_ID = 'your_copied_spreadsheet_id_here';
   ```
6. Click **Deploy** -> **New deployment**.
   - **Type:** Web App
   - **Description:** Shree Devi Services CRM
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Authorize Google permissions.
8. Copy the generated **Web App URL** and add it as `NEXT_PUBLIC_GOOGLE_SHEETS_URL` in your `.env.local`.

---

### 3. Cloudinary Preset Setup

To set up Cloudinary unsigned uploads:
1. Sign up/log in to [Cloudinary](https://cloudinary.com/).
2. Go to **Settings** -> **Upload** settings.
3. Scroll down to **Upload presets** and click **Add upload preset**.
4. Set the **Signing Mode** to **Unsigned**.
5. Save the preset and add its name (`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`) and your Cloud name (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`) to `.env.local`.

---

## 🏃 Run Locally

Install the dependencies:
```bash
pnpm install
```

Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

To build the project for production:
```bash
pnpm build
pnpm start
```
