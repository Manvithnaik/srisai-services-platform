'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Image from 'next/image';
import { uploadImages } from '@/lib/cloudinary';
import { submitToSheets } from '@/lib/sheets';

// ── Types ────────────────────────────────────────────────────────────────────

type LocationData = { latitude: number; longitude: number } | null;
type LocationStatus = 'idle' | 'loading' | 'success' | 'error';

type ImageItem = {
  file: File;
  preview: string;
  cloudinaryUrl?: string;
  uploadPercent?: number;
  uploadStatus: 'pending' | 'uploading' | 'done' | 'error';
};

type SubmitStage =
  | 'idle'
  | 'uploading-images'
  | 'saving-record'
  | 'sending-email'
  | 'done'
  | 'error';

type FormFields = {
  fullName: string;
  phoneNumber: string;
  serviceType: string;
  description: string;
  address: string;
  landmark: string;
  preferredTime: string;
};

// ── Constants ────────────────────────────────────────────────────────────────

const SERVICE_TYPES = [
  'Electrical Repair',
  'Electrical Wiring / Fitting',
  'Fan Installation / Repair',
  'Plumbing Repair',
  'Pipe Leakage / Blockage',
  'Bathroom Fitting',
  'AC Servicing / Repair',
  'Washing Machine Repair',
  'Water Heater / Geyser',
  'Refrigerator Repair',
  'TV / Electronics Repair',
  'General Maintenance',
  'Emergency Repair',
  'Other',
];

const TIME_SLOTS = [
  'Morning (8 AM – 11 AM)',
  'Afternoon (11 AM – 2 PM)',
  'Midday (12 PM – 3 PM)',
  'Evening (3 PM – 6 PM)',
  'Late Evening (6 PM – 8 PM)',
  'Flexible / Any Time',
  'Emergency – ASAP',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateRefNumber(): string {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `SDS-${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}`;
}

function getTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ServiceRequestForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormFields>({
    fullName: '',
    phoneNumber: '',
    serviceType: '',
    description: '',
    address: '',
    landmark: '',
    preferredTime: '',
  });
  const [errors, setErrors] = useState<Partial<FormFields>>({});

  // GPS
  const [location, setLocation] = useState<LocationData>(null);
  const [locStatus, setLocStatus] = useState<LocationStatus>('idle');
  const [locError, setLocError] = useState('');

  // Images
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  // Submission
  const [stage, setStage] = useState<SubmitStage>('idle');
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState<{
    refNumber: string;
    mapsLink: string;
    cloudinaryUrls: string[];
    customerName: string;
    phoneNumber: string;
    serviceType: string;
    description: string;
  } | null>(null);

  // Revoke object URLs on unmount
  useEffect(() => () => { images.forEach(img => URL.revokeObjectURL(img.preview)); }, []);

  // ── Form field change ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  // ── GPS ──
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('error');
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    setLocStatus('loading');
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocStatus('success');
      },
      (err) => {
        setLocStatus('error');
        setLocError(
          err.code === 1
            ? 'Location access denied. Please allow location in browser settings.'
            : 'Unable to get location. Please try again.'
        );
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const clearLocation = () => { setLocation(null); setLocStatus('idle'); setLocError(''); };

  // ── Image handling ──
  const processFiles = useCallback((files: FileList | File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    const toAdd: ImageItem[] = [];
    for (const f of Array.from(files)) {
      if (images.length + toAdd.length >= 5) break;
      if (!validTypes.includes(f.type) && !f.name.toLowerCase().endsWith('.heic')) continue;
      if (f.size > 10 * 1024 * 1024) continue;
      toAdd.push({ file: f, preview: URL.createObjectURL(f), uploadStatus: 'pending' });
    }
    setImages(prev => [...prev, ...toAdd]);
  }, [images]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }, [images]);

  const removeImage = (i: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  // ── Validation ──
  const validate = (): boolean => {
    const e: Partial<FormFields> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phoneNumber.replace(/\s/g, '')))
      e.phoneNumber = 'Enter a valid 10-digit Indian mobile number';
    if (!form.serviceType) e.serviceType = 'Please select a service type';
    if (!form.description.trim()) e.description = 'Please describe the problem';
    else if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.preferredTime) e.preferredTime = 'Please select a preferred visit time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    // ── Snapshot all values immediately before any async work or state resets ──
    const snap = {
      fullName:      form.fullName.trim(),
      phoneNumber:   form.phoneNumber.trim(),
      serviceType:   form.serviceType,
      description:   form.description.trim(),
      address:       form.address.trim(),
      landmark:      form.landmark.trim() || 'Not provided',
      preferredTime: form.preferredTime,
    };

    const refNumber = generateRefNumber();
    const timestamp = getTimestamp();
    const lat = location ? location.latitude.toFixed(6) : '';
    const lng = location ? location.longitude.toFixed(6) : '';
    const mapsLink = location
      ? `https://maps.google.com/?q=${location.latitude},${location.longitude}`
      : '';

    try {
      // ── Step 1: Upload images to Cloudinary ──
      let cloudinaryUrls: string[] = [];
      if (images.length > 0) {
        setStage('uploading-images');
        setUploadPercent(0);
        cloudinaryUrls = await uploadImages(
          images.map(img => img.file),
          (pct) => setUploadPercent(pct)
        );
        setUploadPercent(100);
      }

      const imageUrlsText = cloudinaryUrls.length > 0
        ? cloudinaryUrls.join('\n')
        : 'No images uploaded';

      // ── Step 2: Save to Google Sheets ──
      setStage('saving-record');
      await submitToSheets({
        timestamp,
        referenceNumber: refNumber,
        customerName: snap.fullName,
        phoneNumber: `+91 ${snap.phoneNumber}`,
        serviceType: snap.serviceType,
        address: snap.address,
        landmark: snap.landmark,
        description: snap.description,
        latitude: lat || 'Not captured',
        longitude: lng || 'Not captured',
        mapsLink: mapsLink || 'Not available',
        imageUrls: imageUrlsText,
        status: 'New',
      });

      // ── Step 3: Send EmailJS notification ──
      setStage('sending-email');
      const ejServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const ejTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const ejPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      if (ejServiceId && ejServiceId !== 'YOUR_SERVICE_ID') {
        await emailjs.send(
          ejServiceId,
          ejTemplateId,
          {
            reference_number: refNumber,
            customer_name: snap.fullName,
            phone_number: `+91 ${snap.phoneNumber}`,
            service_type: snap.serviceType,
            address: snap.address,
            landmark: snap.landmark,
            preferred_time: snap.preferredTime,
            description: snap.description,
            latitude: lat || 'Not captured',
            longitude: lng || 'Not captured',
            maps_link: mapsLink || 'Not available',
            cloudinary_image_urls: imageUrlsText,
            timestamp,
          },
          ejPublicKey
        );
      } else {
        console.warn('[EmailJS] Credentials not configured — skipping email.');
      }

      // ── Done — store snapshot so success screen has all data ──
      setSuccessData({
        refNumber,
        mapsLink,
        cloudinaryUrls,
        customerName: snap.fullName,
        phoneNumber: `+91 ${snap.phoneNumber}`,
        serviceType: snap.serviceType,
        description: snap.description,
      });
      setStage('done');

      // Reset form
      setForm({ fullName: '', phoneNumber: '', serviceType: '', description: '', address: '', landmark: '', preferredTime: '' });
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setLocation(null);
      setLocStatus('idle');
      setErrors({});

    } catch (err: any) {
      console.error('[Submit] Error:', err);
      setSubmitError(err?.message || 'Submission failed. Please try again or contact us directly.');
      setStage('error');
    }
  };

  // ── Stage label ──
  const stageLabel: Record<SubmitStage, string> = {
    idle: '🚀 Submit Service Request',
    'uploading-images': `📤 Uploading images… ${uploadPercent}%`,
    'saving-record': '💾 Saving your record…',
    'sending-email': '📧 Sending notification…',
    done: '✅ Done!',
    error: '🚀 Try Again',
  };
  const isSubmitting = ['uploading-images', 'saving-record', 'sending-email'].includes(stage);

  // ── Success screen ───────────────────────────────────────────────────────
  if (stage === 'done' && successData) {
    const { refNumber, mapsLink, cloudinaryUrls, customerName, phoneNumber, serviceType, description } = successData;

    const imageSection = cloudinaryUrls.length > 0
      ? `\n\nImages (${cloudinaryUrls.length}):\n${cloudinaryUrls.join('\n')}`
      : '';

    const whatsappMessage = encodeURIComponent(
      `Hello Shree Devi Services,\n\nReference Number: ${refNumber}\nName: ${customerName}\nPhone: ${phoneNumber}\nService: ${serviceType}\nIssue: ${description}\nLocation: ${mapsLink || 'Not captured'}${imageSection}\n\nI submitted this request through your website.`
    );

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div className="text-8xl mb-6 animate-bounce">✅</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Request Submitted Successfully!</h1>
          <p className="text-gray-500 mb-8">Our team will contact you shortly to confirm the visit.</p>

          {/* Reference number card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-green-100">
            <p className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">Your Reference Number</p>
            <div className="bg-green-50 rounded-xl py-4 px-6 border-2 border-green-200 mb-3">
              <p className="text-2xl font-black text-green-700 font-mono tracking-wider">{refNumber}</p>
            </div>
            <p className="text-xs text-gray-400">Save this number to track your request</p>
          </div>

          {/* Details summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 text-left space-y-2.5 text-sm">
            {cloudinaryUrls.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span className="text-gray-600"><strong>{cloudinaryUrls.length}</strong> image{cloudinaryUrls.length > 1 ? 's' : ''} uploaded to cloud</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <span className="text-gray-600">Record saved to service log</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <span className="text-gray-600">Email notification sent to team</span>
            </div>
            {mapsLink && (
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Location shared ↗
                </a>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <a
              href={`https://wa.me/917337843016?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl text-base"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
              </svg>
              Continue on WhatsApp
            </a>
            <a
              href="tel:+917337843016"
              className="flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all text-base"
            >
              📞 Call: +91 73378 43016
            </a>
          </div>

          <button
            onClick={() => { setStage('idle'); setSuccessData(null); }}
            className="text-sm text-gray-400 hover:text-gray-600 underline transition"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  // ── Main Form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-4">
            🔧 Quick &amp; Easy Booking
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Book a Service</h1>
          <p className="text-blue-100 text-lg">
            Fill in the details — our team will call you within 30 minutes to confirm.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Error banner */}
        {stage === 'error' && submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-bold mb-1">Submission Failed</p>
              <p className="text-sm mb-2">{submitError}</p>
              <div className="flex gap-3">
                <a href="https://wa.me/917337843016" target="_blank" rel="noopener noreferrer"
                  className="text-green-600 font-semibold underline text-sm">WhatsApp Us →</a>
                <a href="tel:+917337843016" className="text-blue-600 font-semibold underline text-sm">📞 Call</a>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ─── Section 1: Personal Info ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-black">1</span>
              Personal Information
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
              <input
                type="text" name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">⚠ {errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm select-none">+91</span>
                <input
                  type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                  placeholder="10-digit mobile number" maxLength={10}
                  className={`w-full pl-14 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base ${errors.phoneNumber ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">⚠ {errors.phoneNumber}</p>}
            </div>
          </div>

          {/* ─── Section 2: Service Details ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-black">2</span>
              Service Details
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Type *</label>
              <select
                name="serviceType" value={form.serviceType} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base bg-white ${errors.serviceType ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">Select service type...</option>
                {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.serviceType && <p className="text-red-500 text-sm mt-1">⚠ {errors.serviceType}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Problem Description *</label>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="Describe the issue in detail — e.g., 'Power socket not working, sparks visible near kitchen…'"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base resize-none ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              <div className="flex justify-between mt-1">
                {errors.description
                  ? <p className="text-red-500 text-sm">⚠ {errors.description}</p>
                  : <span />}
                <span className="text-xs text-gray-400">{form.description.length} chars</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Visit Time *</label>
              <select
                name="preferredTime" value={form.preferredTime} onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base bg-white ${errors.preferredTime ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">Select preferred time...</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.preferredTime && <p className="text-red-500 text-sm mt-1">⚠ {errors.preferredTime}</p>}
            </div>
          </div>

          {/* ─── Section 3: Location ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-black">3</span>
              Location Details
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address *</label>
              <input
                type="text" name="address" value={form.address} onChange={handleChange}
                placeholder="House/Flat No., Street, Area, City"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">⚠ {errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Landmark <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                type="text" name="landmark" value={form.landmark} onChange={handleChange}
                placeholder="Near a shop, temple, school, etc."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-base"
              />
            </div>

            {/* GPS Location */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">📍 Use My Current Location</p>
                  <p className="text-xs text-gray-500 mt-0.5">Helps our team find you faster</p>
                </div>
                {locStatus !== 'idle' && (
                  <div className="flex gap-2">
                    {locStatus === 'success' && (
                      <button type="button" onClick={getLocation}
                        className="text-xs px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition">
                        🔄 Refresh
                      </button>
                    )}
                    <button type="button" onClick={clearLocation}
                      className="text-xs px-3 py-1.5 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 font-medium transition">
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>

              {locStatus === 'idle' && (
                <button type="button" onClick={getLocation}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm">
                  📍 Use My Current Location
                </button>
              )}

              {locStatus === 'loading' && (
                <div className="text-center py-3">
                  <div className="w-6 h-6 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-blue-600 text-sm font-medium">Getting your location…</span>
                </div>
              )}

              {locStatus === 'success' && location && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-1.5">
                  <p className="font-bold text-green-700 text-sm mb-2">📍 Location Captured Successfully</p>
                  <p className="text-gray-700 text-sm">
                    Latitude: <span className="font-mono font-semibold text-green-700">{location.latitude.toFixed(6)}</span>
                  </p>
                  <p className="text-gray-700 text-sm">
                    Longitude: <span className="font-mono font-semibold text-green-700">{location.longitude.toFixed(6)}</span>
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-1 text-xs text-blue-600 underline hover:text-blue-800 transition"
                  >
                    View on Google Maps ↗
                  </a>
                </div>
              )}

              {locStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm font-medium">⚠ {locError}</p>
                  <button type="button" onClick={getLocation}
                    className="mt-2 text-blue-600 underline text-xs font-medium">
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Section 4: Upload Images ─── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-black">4</span>
              Upload Photos
              <span className="text-sm font-normal text-gray-400">(Optional)</span>
            </h2>
            <p className="text-sm text-gray-500">
              Photos help our technician arrive prepared. Max 5 images, 10 MB each.
              Images are uploaded to our secure cloud storage.
            </p>

            {/* Upload progress bar */}
            {stage === 'uploading-images' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Uploading to cloud…</span>
                  <span>{uploadPercent}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => images.length < 5 && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              } ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleFileInput}
                className="hidden"
                disabled={images.length >= 5}
              />
              <div className="text-4xl mb-3">📷</div>
              <p className="font-semibold text-gray-700 text-sm">
                {isDragging ? 'Drop images here!' : images.length >= 5 ? 'Maximum 5 images reached' : 'Tap to upload or drag & drop'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Up to 10 MB each · Max 5 images</p>
              <p className="text-xs text-blue-500 mt-2 font-medium">📱 On mobile: Camera or Gallery</p>
            </div>

            {/* Image previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                {images.map((img, i) => (
                  <div key={img.preview} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <Image src={img.preview} alt={`Upload ${i + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >✕</button>
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                      {(img.file.size / 1024).toFixed(0)}KB
                    </div>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400 text-center">{images.length}/5 images selected</p>
          </div>

          {/* ─── Submit button ─── */}
          <div className="space-y-3 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-3"
            >
              {isSubmitting
                ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{stageLabel[stage]}</>
                : stageLabel[stage === 'error' ? 'error' : 'idle']
              }
            </button>

            <p className="text-center text-xs text-gray-400">
              By submitting, you agree to be contacted by our team regarding your service request.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
                target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
                </svg>
                Or Chat on WhatsApp
              </a>
              <a
                href="tel:+917337843016"
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
              >
                📞 Call: +91 73378 43016
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
