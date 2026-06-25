'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, AlertCircle, Camera, X, RefreshCw, Navigation, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { uploadImages } from '@/lib/cloudinary';
import { submitToSheets } from '@/lib/sheets';
import { sendTelegramNotification } from '@/lib/telegram';

// ── Constants ─────────────────────────────────────────────────────────────────
const SERVICE_TYPES = [
  'Electrical Repair',
  'Electrical Wiring / Fitting',
  'Fan Installation / Repair',
  'Plumbing Repair',
  'Pipe Leak / Blockage',
  'Bathroom Fitting',
  'AC Servicing / Repair',
  'Washing Machine Repair',
  'Water Heater / Geyser',
  'Refrigerator Repair',
  'Water Tank Cleaning',
  'Home Maintenance',
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

type LocationState = 'idle' | 'loading' | 'success' | 'error';
type SubmitStage = 'idle' | 'uploading-images' | 'saving-record' | 'sending-email' | 'done' | 'error';
type UploadedImage = { file: File; preview: string };

function generateRef(): string {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `SDS-${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}`;
}

function getTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookingForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    service: '',
    problem: '',
    address: '',
    landmark: '',
    timeSlot: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  // GPS
  const [locState, setLocState] = useState<LocationState>('idle');
  const [locError, setLocError] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const latestLocationRef = useRef<{ lat: number; lng: number; accuracy: number } | null>(null);

  // Images
  const [images, setImages]     = useState<UploadedImage[]>([]);
  const [isDragging, setIsDrag] = useState(false);
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

  // Cleanup on unmount
  useEffect(() => () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
  }, []);

  // ── Field change & blur ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    // Live-clear error once field has been touched and is now valid
    if (touched[name]) {
      setErrors(p => ({ ...p, [name]: '' }));
    }
    if (showValidationSummary) setShowValidationSummary(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    // Validate individual field on blur
    const fieldErrors = validateFields(formData);
    if (fieldErrors[name]) {
      setErrors(p => ({ ...p, [name]: fieldErrors[name] }));
    }
  };

  // ── GPS ──
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocState('error');
      setLocError('Geolocation not supported by your browser.');
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setLocState('loading');
    setLocError('');
    setLocation(null);
    latestLocationRef.current = null;

    const GOOD_ACCURACY_METERS = 200;
    const WATCH_TIMEOUT_MS = 20000;

    let settled = false;
    const deadline = setTimeout(() => {
      if (!settled && watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        
        const finalLoc = latestLocationRef.current;
        if (finalLoc) {
          setLocState('success');
        } else {
          setLocState('error');
          setLocError('Location request timed out. Please enter your address manually.');
        }
      }
    }, WATCH_TIMEOUT_MS);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude, accuracy };
        latestLocationRef.current = newLoc;
        setLocation(newLoc);

        if (accuracy <= GOOD_ACCURACY_METERS && !settled) {
          settled = true;
          clearTimeout(deadline);
          navigator.geolocation.clearWatch(watchIdRef.current!);
          watchIdRef.current = null;
          setLocState('success');
        } else {
          setLocState('loading');
        }
      },
      (err) => {
        clearTimeout(deadline);
        if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setLocState('error');
        setLocError(
          err.code === 1
            ? 'Location permission denied. Please allow in browser settings.'
            : 'Could not get location. Try again or enter manually.'
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: WATCH_TIMEOUT_MS,
      }
    );
  };

  const clearLocation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    latestLocationRef.current = null;
    setLocation(null);
    setLocState('idle');
    setLocError('');
  };

  // ── Image upload ──
  const processFiles = useCallback((files: FileList | File[]) => {
    const valid = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    const toAdd: UploadedImage[] = [];
    for (const f of Array.from(files)) {
      if (images.length + toAdd.length >= 5) break;
      if (!valid.includes(f.type) && !f.name.toLowerCase().endsWith('.heic')) continue;
      if (f.size > 10 * 1024 * 1024) continue;
      toAdd.push({ file: f, preview: URL.createObjectURL(f) });
    }
    setImages(prev => [...prev, ...toAdd]);
  }, [images]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const removeImage = (i: number) => {
    setImages(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i); });
  };

  // ── Validation helpers ──
  const validateFields = (data: typeof formData): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim())
      e.fullName = 'Please enter your full name';
    else if (data.fullName.trim().length < 3)
      e.fullName = 'Name must be at least 3 characters';

    if (!data.phone.trim())
      e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(data.phone.replace(/[\s\-+()/]/g, '')))
      e.phone = 'Enter a valid 10-digit mobile number (e.g. 9876543210)';

    if (!data.service)
      e.service = 'Please select the type of service you need';

    if (!data.problem.trim())
      e.problem = 'Please describe your problem so we can send the right technician';
    else if (data.problem.trim().split(/\s+/).filter(Boolean).length < 5)
      e.problem = 'Please describe in more detail — at least 5 words (e.g. "Power socket not working near kitchen")';

    if (!data.address.trim())
      e.address = 'Address is required so our technician knows where to come';
    else if (data.address.trim().length < 10)
      e.address = 'Please enter a complete address (house no., street, area)';

    if (!data.timeSlot)
      e.timeSlot = 'Please choose a preferred time slot for the visit';

    return e;
  };

  const validate = () => {
    const e = validateFields(formData);
    setErrors(e);
    const hasErrors = Object.keys(e).length > 0;
    if (hasErrors) {
      setShowValidationSummary(true);
      // Mark all fields as touched so inline errors show
      setTouched({ fullName: true, phone: true, service: true, problem: true, address: true, timeSlot: true });
      // Scroll to top of form
      setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
    return !hasErrors;
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    // ── Snapshot all values immediately before any async work or state resets ──
    const snap = {
      fullName:  formData.fullName.trim(),
      phone:     formData.phone.trim(),
      service:   formData.service,
      problem:   formData.problem.trim(),
      address:   formData.address.trim(),
      landmark:  formData.landmark.trim() || 'Not provided',
      timeSlot:  formData.timeSlot,
    };

    const ref = generateRef();
    const timestamp = getTimestamp();
    const lat = location ? location.lat.toFixed(6) : '';
    const lng = location ? location.lng.toFixed(6) : '';
    const mapsLink = location
      ? `https://maps.google.com/?q=${location.lat},${location.lng}`
      : '';

    try {
      // Step 1: Upload images to Cloudinary
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

      // Step 2: Save to Google Sheets
      setStage('saving-record');
      await submitToSheets({
        timestamp,
        referenceNumber: ref,
        customerName: snap.fullName,
        phoneNumber: `+91 ${snap.phone}`,
        serviceType: snap.service,
        address: snap.address,
        landmark: snap.landmark,
        description: snap.problem,
        latitude: lat || 'Not captured',
        longitude: lng || 'Not captured',
        mapsLink: mapsLink || 'Not available',
        imageUrls: imageUrlsText,
        status: 'New',
      });

      // Step 3: Send email + Telegram notification simultaneously
      setStage('sending-email');
      const ejServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const ejTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const ejPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      const telegramPayload = {
        referenceNumber: ref,
        customerName: snap.fullName,
        phoneNumber: `+91 ${snap.phone}`,
        serviceType: snap.service,
        address: snap.address,
        landmark: snap.landmark,
        description: snap.problem,
        latitude: lat || 'Not captured',
        longitude: lng || 'Not captured',
        mapsLink: mapsLink || 'Not available',
        imageUrls: imageUrlsText,
        timestamp,
      };

      await Promise.all([
        // EmailJS
        ejServiceId && ejServiceId !== 'YOUR_SERVICE_ID'
          ? emailjs.send(
              ejServiceId,
              ejTemplateId,
              {
                reference_number: ref,
                customer_name: snap.fullName,
                phone_number: `+91 ${snap.phone}`,
                service_type: snap.service,
                address: snap.address,
                landmark: snap.landmark,
                preferred_time: snap.timeSlot,
                description: snap.problem,
                latitude: lat || 'Not captured',
                longitude: lng || 'Not captured',
                maps_link: mapsLink || 'Not available',
                cloudinary_image_urls: imageUrlsText,
                timestamp,
              },
              ejPublicKey
            )
          : Promise.resolve(),
        // Telegram (errors swallowed inside the helper)
        sendTelegramNotification(telegramPayload),
      ]);

      // Done — store snapshot in successData so success screen has all data
      setSuccessData({
        refNumber: ref,
        mapsLink,
        cloudinaryUrls,
        customerName: snap.fullName,
        phoneNumber: `+91 ${snap.phone}`,
        serviceType: snap.service,
        description: snap.problem,
      });
      setStage('done');

      // Reset
      setFormData({ fullName: '', phone: '', service: '', problem: '', address: '', landmark: '', timeSlot: '' });
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]);
      setLocation(null);
      setLocState('idle');

    } catch (err: any) {
      console.error('[BookingForm] Submit error:', err);
      setSubmitError(err?.message || 'Submission failed. Please try again.');
      setStage('error');
    }
  };

  const isSubmitting = ['uploading-images', 'saving-record', 'sending-email'].includes(stage);

  const stageLabel: Record<SubmitStage, string> = {
    idle: '📧 Send Service Request',
    'uploading-images': `📤 Uploading images… ${uploadPercent}%`,
    'saving-record': '💾 Saving record…',
    'sending-email': '📧 Sending notification…',
    done: '✅ Done!',
    error: '📧 Try Again',
  };

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (stage === 'done' && successData) {
    const { refNumber, mapsLink, cloudinaryUrls, customerName, phoneNumber, serviceType, description } = successData;

    const imageSection = cloudinaryUrls.length > 0
      ? `\n\nImages (${cloudinaryUrls.length}):\n${cloudinaryUrls.join('\n')}`
      : '';

    const whatsappMessage = encodeURIComponent(
      `Hello Shree Devi Services,\n\nReference Number: ${refNumber}\nName: ${customerName}\nPhone: ${phoneNumber}\nService: ${serviceType}\nIssue: ${description}\nLocation: ${mapsLink || 'Not captured'}${imageSection}\n\nI submitted this request through your website.`
    );

    return (
      <section id="booking" className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-md mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="text-7xl mb-6">✅</div>
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Request Submitted Successfully!</h2>
          <p className="text-gray-500 mb-2">Your request has been logged and our team has been notified.</p>
          <p className="text-gray-400 text-sm mb-8">We'll call you within 30 minutes to confirm the visit.</p>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-4 border border-green-100">
            <p className="text-sm text-gray-500 mb-2 font-medium">Your Reference Number</p>
            <div className="bg-green-50 rounded-xl py-4 px-6 border-2 border-green-200">
              <p className="text-2xl font-black text-green-700 font-mono tracking-wider">{refNumber}</p>
            </div>
          </div>

          {/* Summary checklist */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              Record saved to service log
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              Email notification sent to team
            </div>
            {mapsLink && (
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Location shared ↗</a>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/918431759374?text=${whatsappMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
              </svg>
              Continue on WhatsApp
            </a>
            <a href="tel:+918431759374" className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition">
              📞 Call: +91 84317 59374
            </a>
          </div>
          <button
            onClick={() => { setStage('idle'); setSuccessData(null); }}
            className="mt-5 text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Submit another request
          </button>
        </div>
      </section>
    );
  }

  // ─── Form ────────────────────────────────────────────────────────────────────
  return (
    <section id="booking" className="py-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/80 text-sm font-semibold mb-3">
            🔧 Book a Service — Shankarpura, Udupi
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-2">
            Get Your Issue Fixed <span className="text-orange-400">Today</span>
          </h2>
          <p className="text-blue-200 text-lg">Fill the form — we'll call you within 30 minutes to confirm.</p>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {stage === 'error' && submitError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 flex items-start gap-3 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Submission Failed</p>
                <p className="text-sm">{submitError}</p>
                <div className="flex gap-4 mt-1">
                  <a href="tel:+918431759374" className="text-blue-600 font-semibold underline text-sm">📞 Call us</a>
                  <a href="https://wa.me/918431759374" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold underline text-sm">WhatsApp →</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop two-column / mobile single column */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* ─── Main Form ─── */}
          <motion.form
            onSubmit={handleSubmit}
            ref={formTopRef as React.RefObject<HTMLFormElement>}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-5"
          >
            {/* Validation Summary Banner */}
            <AnimatePresence>
              {showValidationSummary && Object.keys(errors).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-red-50 border-2 border-red-300 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                    <p className="font-black text-red-700 text-sm">Please fix the following before submitting:</p>
                  </div>
                  <ul className="space-y-1">
                    {Object.values(errors).map((msg, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-red-600 text-xs">
                        <span className="mt-0.5 flex-shrink-0">•</span>
                        {msg}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition text-sm ${
                    errors.fullName ? 'border-red-400 bg-red-50 focus:border-red-500' :
                    touched.fullName && !errors.fullName && formData.fullName ? 'border-green-400 focus:border-green-500' :
                    'border-gray-200 focus:border-blue-500'
                  }`}
                />
                {errors.fullName
                  ? <p className="text-red-500 text-xs mt-1 flex items-start gap-1"><span>⚠</span> {errors.fullName}</p>
                  : touched.fullName && formData.fullName && <p className="text-green-600 text-xs mt-1">✓ Looks good!</p>
                }
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1"><Phone size={14} /> Phone *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">+91</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                    placeholder="10-digit number" maxLength={10}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition text-sm ${
                      errors.phone ? 'border-red-400 bg-red-50 focus:border-red-500' :
                      touched.phone && !errors.phone && formData.phone.length === 10 ? 'border-green-400 focus:border-green-500' :
                      'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.phone
                  ? <p className="text-red-500 text-xs mt-1 flex items-start gap-1"><span>⚠</span> {errors.phone}</p>
                  : touched.phone && formData.phone.length === 10 && <p className="text-green-600 text-xs mt-1">✓ Valid number</p>
                }
                <p className="text-gray-400 text-xs mt-1.5 flex items-start gap-1">
                  <span className="flex-shrink-0">🔒</span>
                  Your number is only shared with the assigned technician to contact you. Your privacy is fully protected.
                </p>
              </div>
            </div>

            {/* Service + Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Service Type *</label>
                <select name="service" value={formData.service} onChange={handleChange} onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition text-sm bg-white ${
                    errors.service ? 'border-red-400 bg-red-50 focus:border-red-500' :
                    touched.service && formData.service ? 'border-green-400 focus:border-green-500' :
                    'border-gray-200 focus:border-blue-500'
                  }`}>
                  <option value="">Select service...</option>
                  {SERVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.service
                  ? <p className="text-red-500 text-xs mt-1 flex items-start gap-1"><span>⚠</span> {errors.service}</p>
                  : touched.service && formData.service && <p className="text-green-600 text-xs mt-1">✓ Service selected</p>
                }
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1"><Clock size={14} /> Preferred Time *</label>
                <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} onBlur={handleBlur}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition text-sm bg-white ${
                    errors.timeSlot ? 'border-red-400 bg-red-50 focus:border-red-500' :
                    touched.timeSlot && formData.timeSlot ? 'border-green-400 focus:border-green-500' :
                    'border-gray-200 focus:border-blue-500'
                  }`}>
                  <option value="">Select time slot...</option>
                  {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.timeSlot
                  ? <p className="text-red-500 text-xs mt-1 flex items-start gap-1"><span>⚠</span> {errors.timeSlot}</p>
                  : touched.timeSlot && formData.timeSlot && <p className="text-green-600 text-xs mt-1">✓ Time selected</p>
                }
              </div>
            </div>

            {/* Problem */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-gray-700">Problem Description *</label>
                <span className={`text-xs font-medium ${
                  formData.problem.trim().split(/\s+/).filter(Boolean).length >= 5 ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {formData.problem.trim().split(/\s+/).filter(Boolean).length} / 5 words min
                </span>
              </div>
              <textarea name="problem" value={formData.problem} onChange={handleChange} onBlur={handleBlur} rows={4}
                placeholder="Describe the issue clearly — e.g. 'Power socket not working near kitchen, sparks visible when plugging in'"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition text-sm resize-none ${
                  errors.problem ? 'border-red-400 bg-red-50 focus:border-red-500' :
                  touched.problem && !errors.problem && formData.problem.trim().split(/\s+/).filter(Boolean).length >= 5 ? 'border-green-400 focus:border-green-500' :
                  'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.problem
                ? <p className="text-red-500 text-xs mt-1 flex items-start gap-1"><span>⚠</span> {errors.problem}</p>
                : <p className="text-gray-400 text-xs mt-1">Tip: Mention the location inside your home and when the issue started.</p>
              }
            </div>

            {/* Address + Landmark */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1"><MapPin size={14} /> Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur}
                placeholder="House no., Street, Area — Shankarpura / Udupi"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition text-sm ${
                  errors.address ? 'border-red-400 bg-red-50 focus:border-red-500' :
                  touched.address && !errors.address && formData.address.trim().length >= 10 ? 'border-green-400 focus:border-green-500' :
                  'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.address
                ? <p className="text-red-500 text-xs mt-1 flex items-start gap-1"><span>⚠</span> {errors.address}</p>
                : <p className="text-gray-400 text-xs mt-1">Include house number, street name and area for accuracy.</p>
              }
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Landmark <span className="font-normal text-gray-400">(optional — helps us find you faster)</span></label>
              <input type="text" name="landmark" value={formData.landmark} onChange={handleChange}
                placeholder="Near temple, school, shop..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Upload progress bar (visible during upload) */}
            {stage === 'uploading-images' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>Uploading images to cloud…</span>
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

            {/* Submit */}
            <motion.button type="submit" disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }} whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{stageLabel[stage]}</>
                : stageLabel[stage === 'error' ? 'error' : 'idle']
              }
            </motion.button>

            <p className="text-center text-gray-400 text-xs">
              Images uploaded to secure cloud · Record saved · Email sent to team
            </p>
          </motion.form>

          {/* ─── Side Panel ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {/* GPS Location */}
            <div className="bg-white rounded-2xl shadow-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Navigation size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Use My Current Location</p>
                  <p className="text-xs text-gray-400">GPS coordinates sent with your request</p>
                </div>
              </div>

              {locState === 'idle' && (
                <button onClick={getLocation} type="button"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-2">
                  <Navigation size={16} /> Capture My Location
                </button>
              )}

              {locState === 'loading' && (
                <div className="text-center py-3">
                  <div className="w-7 h-7 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-blue-600 text-xs font-medium animate-pulse">Getting your GPS location...</p>
                  {location && (
                    <p className="text-[10px] text-gray-400 mt-1">Refining… accuracy ~{Math.round(location.accuracy)} m</p>
                  )}
                  {!location && (
                    <p className="text-[10px] text-gray-400 mt-1">Please wait, this may take a few seconds</p>
                  )}
                </div>
              )}

              {locState === 'success' && location && (
                <div className="space-y-2">
                  <div
                    className="rounded-xl p-3 border"
                    style={{
                      background: location.accuracy <= 500 ? '#F0FDF4' : '#FFFBEB',
                      borderColor: location.accuracy <= 500 ? '#86EFAC' : '#FCD34D',
                    }}
                  >
                    <p className={`font-bold text-xs mb-1 ${location.accuracy <= 500 ? 'text-green-700' : 'text-amber-700'}`}>
                      {location.accuracy <= 500 ? '📍 Location Captured Successfully' : '⚠️ Low Accuracy Location'}
                    </p>
                    <p className="font-mono text-xs text-gray-700">Latitude: <span className="font-bold">{location.lat.toFixed(6)}</span></p>
                    <p className="font-mono text-xs text-gray-700">Longitude: <span className="font-bold">{location.lng.toFixed(6)}</span></p>
                    <p className={`text-[10px] font-semibold mt-1 ${location.accuracy <= 200 ? 'text-green-600' : location.accuracy <= 500 ? 'text-amber-600' : 'text-red-500'}`}>
                      Accuracy: ~{Math.round(location.accuracy)} m
                      {location.accuracy > 500 && ' — please type your address for precision'}
                    </p>
                    <a href={`https://maps.google.com/?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline mt-1.5 inline-block font-medium">View on Maps ↗</a>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={getLocation}
                      className="flex-1 py-2 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1">
                      <RefreshCw size={11} /> Retry
                    </button>
                    <button type="button" onClick={clearLocation}
                      className="flex-1 py-2 text-xs font-bold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1">
                      <X size={11} /> Remove
                    </button>
                  </div>
                </div>
              )}

              {locState === 'error' && (
                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-medium">⚠ {locError}</div>
                  <button type="button" onClick={getLocation}
                    className="w-full py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">Try Again</button>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-2xl shadow-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Camera size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Upload Fault Images</p>
                  <p className="text-xs text-gray-400">Uploaded to secure cloud · Max 5 photos</p>
                </div>
              </div>

              {/* Mobile bottom sheet */}
              {showMobileSheet && (
                <div
                  className="fixed inset-0 z-50 flex items-end justify-center"
                  style={{ background: 'rgba(0,0,0,0.45)' }}
                  onClick={() => setShowMobileSheet(false)}
                >
                  <div
                    className="w-full max-w-lg rounded-t-3xl p-6 space-y-3"
                    style={{ background: 'white' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                    <p className="text-center font-black text-gray-800 text-base mb-4">Add Photos</p>

                    <button
                      type="button"
                      onClick={() => { setShowMobileSheet(false); cameraInputRef.current?.click(); }}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-left transition-all active:scale-95"
                      style={{ background: '#FFF7ED', color: '#C2410C' }}
                    >
                      <span className="text-2xl">📷</span>
                      <div>
                        <p className="font-black text-sm">Take a Photo</p>
                        <p className="text-xs font-normal text-orange-400">Opens your device camera</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setShowMobileSheet(false); fileInputRef.current?.click(); }}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-left transition-all active:scale-95"
                      style={{ background: '#F0FDF4', color: '#2D5A27' }}
                    >
                      <span className="text-2xl">🖼️</span>
                      <div>
                        <p className="font-black text-sm">Choose from Gallery</p>
                        <p className="text-xs font-normal text-green-500">Select one or more existing photos</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowMobileSheet(false)}
                      className="w-full py-3 rounded-2xl text-gray-400 font-semibold text-sm mt-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Gallery input — no capture */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
                disabled={images.length >= 5}
              />
              {/* Camera input — forces camera on mobile */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInput}
                className="hidden"
                disabled={images.length >= 5}
              />

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
                onDragLeave={() => setIsDrag(false)}
                onDrop={handleDrop}
                onClick={() => {
                  if (images.length >= 5) return;
                  if (isMobile()) { setShowMobileSheet(true); }
                  else { fileInputRef.current?.click(); }
                }}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  isDragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                } ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-3xl mb-1.5">📷</div>
                <p className="text-sm font-semibold text-gray-600">
                  {isDragging ? 'Drop here!' : images.length >= 5 ? 'Maximum 5 images reached' : 'Tap to take a photo or choose from gallery'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Camera · Gallery · Drag &amp; Drop · 10MB max</p>
                <p className="text-xs text-orange-400 font-semibold mt-1">📱 Mobile: choose camera or gallery</p>
              </div>

              {/* Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {images.map((img, i) => (
                    <div key={img.preview} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <Image src={img.preview} alt={`Upload ${i + 1}`} fill className="object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                        <X size={10} />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] px-1 py-0.5 text-center">
                        {(img.file.size / 1024).toFixed(0)}KB
                      </div>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => { if (isMobile()) { setShowMobileSheet(true); } else { fileInputRef.current?.click(); } }}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-orange-300 flex items-center justify-center text-gray-300 hover:text-orange-400 transition text-2xl"
                    >
                      +
                    </button>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2 text-center">{images.length}/5 images · Uploaded to Cloudinary</p>
            </div>

            {/* Contact fallback */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-white">
              <p className="font-bold text-sm text-white/90 mb-2">Prefer direct contact?</p>
              <a href="tel:+918431759374" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition py-1">📞 +91 84317 59374</a>
              <a href="https://wa.me/918431759374?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-300 hover:text-green-200 transition py-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
