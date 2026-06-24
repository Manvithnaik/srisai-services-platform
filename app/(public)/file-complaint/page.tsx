'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Camera, X, RefreshCw, Navigation, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { uploadImages } from '@/lib/cloudinary';
import { submitToSheets } from '@/lib/sheets';
import { sendTelegramNotification } from '@/lib/telegram';
import { useToast } from '@/components/ui/Toast';

// ── Constants ────────────────────────────────────────────────────────────────

const SERVICE_TYPES = [
  { label: 'Electrical Repair', emoji: '⚡' },
  { label: 'Electrical Wiring / Fitting', emoji: '🔌' },
  { label: 'Fan Installation / Repair', emoji: '🌀' },
  { label: 'Plumbing Repair', emoji: '💧' },
  { label: 'Pipe Leakage / Blockage', emoji: '🚰' },
  { label: 'Bathroom Fitting', emoji: '🚿' },
  { label: 'AC Servicing / Repair', emoji: '❄️' },
  { label: 'Washing Machine Repair', emoji: '🌊' },
  { label: 'Water Heater / Geyser', emoji: '🔥' },
  { label: 'Refrigerator Repair', emoji: '🧊' },
  { label: 'TV / Electronics Repair', emoji: '📺' },
  { label: 'General Maintenance', emoji: '🏠' },
  { label: 'Emergency Repair', emoji: '🚨' },
  { label: 'Other', emoji: '🔧' },
];



type LocationData = { latitude: number; longitude: number; accuracy: number } | null;
type LocationStatus = 'idle' | 'loading' | 'success' | 'error';
type ImageItem = { file: File; preview: string; uploadStatus: 'pending' | 'uploading' | 'done' | 'error' };
type SubmitStage = 'idle' | 'uploading-images' | 'saving-record' | 'sending-email' | 'done' | 'error';

type FormFields = {
  fullName: string;
  phoneNumber: string;
  serviceType: string;
  description: string;
  address: string;
  landmark: string;
};

function generateRefNumber(): string {
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

const WA_ICON = (
  <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
  </svg>
);

// ── Field components ─────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-bold text-gray-700 mb-2">{children}</label>;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold"
    >
      ⚠ {msg}
    </motion.p>
  );
}

function SectionCard({ num, title, emoji, children }: { num: string; title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 space-y-5"
      style={{ background: 'white', border: '2px solid #1565C015', boxShadow: '0 2px 20px rgba(21,101,192,0.06)' }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-black flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1565C0, #1E88E5)' }}
        >
          {num}
        </div>
        <h2 className="text-lg font-black text-[#1A1A2E]">
          {emoji} {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ServiceRequestForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const [form, setForm] = useState<FormFields>({
    fullName: '', phoneNumber: '', serviceType: '', description: '',
    address: '', landmark: '',
  });
  const [errors, setErrors] = useState<Partial<FormFields>>({});

  const [location, setLocation] = useState<LocationData>(null);
  const [locStatus, setLocStatus] = useState<LocationStatus>('idle');
  const [locError, setLocError] = useState('');
  const watchIdRef = useRef<number | null>(null);
  const latestLocationRef = useRef<LocationData>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const [stage, setStage] = useState<SubmitStage>('idle');
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState<{
    refNumber: string; mapsLink: string; cloudinaryUrls: string[];
    customerName: string; phoneNumber: string; serviceType: string; description: string;
  } | null>(null);

  useEffect(() => () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
  }, []);

  // ── Handlers ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) { setLocStatus('error'); setLocError('Geolocation not supported by your browser.'); return; }

    // Clear any previous watcher
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setLocStatus('loading'); setLocError(''); setLocation(null);
    latestLocationRef.current = null;

    const GOOD_ACCURACY_METERS = 200; // stop watching once we're within 200 m
    const WATCH_TIMEOUT_MS = 20000;   // give up after 20 s total

    let settled = false;
    const deadline = setTimeout(() => {
      if (!settled && watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        
        const finalLoc = latestLocationRef.current;
        if (finalLoc) {
          setLocStatus('success');
          toastInfo('Best location found', `Accuracy: ~${Math.round(finalLoc.accuracy)} m — consider entering address manually for precision.`);
        } else {
          setLocStatus('error');
          setLocError('Could not get a reliable location. Please enter your address manually.');
          toastError('Location timed out', 'GPS could not find you. Please type your address.');
        }
      }
    }, WATCH_TIMEOUT_MS);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newLoc = { latitude, longitude, accuracy };
        latestLocationRef.current = newLoc;
        setLocation(newLoc);

        if (accuracy <= GOOD_ACCURACY_METERS && !settled) {
          settled = true;
          clearTimeout(deadline);
          navigator.geolocation.clearWatch(watchIdRef.current!);
          watchIdRef.current = null;
          setLocStatus('success');
          toastSuccess('Location captured!', `Accurate to ~${Math.round(accuracy)} m.`);
        } else {
          // Keep 'loading' while refining — UI shows live accuracy update
          setLocStatus('loading');
        }
      },
      (err) => {
        clearTimeout(deadline);
        if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
        setLocStatus('error');
        setLocError(
          err.code === 1
            ? 'Location access denied. Please allow location in your browser settings.'
            : 'Could not get your location. Try again or enter address manually.'
        );
        toastError('Location failed', 'Please allow location access or type your address.');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,        // never use a cached position
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
    setLocation(null); setLocStatus('idle'); setLocError('');
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    const toAdd: ImageItem[] = [];
    for (const f of Array.from(files)) {
      if (images.length + toAdd.length >= 5) break;
      if (!validTypes.includes(f.type) && !f.name.toLowerCase().endsWith('.heic')) continue;
      if (f.size > 10 * 1024 * 1024) { toastError('File too large', 'Max 10 MB per image.'); continue; }
      toAdd.push({ file: f, preview: URL.createObjectURL(f), uploadStatus: 'pending' });
    }
    if (toAdd.length) { setImages(prev => [...prev, ...toAdd]); toastInfo(`${toAdd.length} photo${toAdd.length > 1 ? 's' : ''} added`); }
  }, [images, toastError, toastInfo]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removeImage = (i: number) => {
    setImages(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i); });
  };

  const validate = (): boolean => {
    const e: Partial<FormFields> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phoneNumber.replace(/\s/g, ''))) e.phoneNumber = 'Enter a valid 10-digit Indian mobile number';
    if (!form.serviceType) e.serviceType = 'Please select a service type';
    if (!form.description.trim()) e.description = 'Please describe the problem';
    else if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    if (Object.keys(e).length > 0) toastError('Please fix the errors', 'Some required fields are missing or incorrect.');
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    const snap = {
      fullName: form.fullName.trim(), phoneNumber: form.phoneNumber.trim(),
      serviceType: form.serviceType, description: form.description.trim(),
      address: form.address.trim(), landmark: form.landmark.trim() || 'Not provided',
    };

    const refNumber = generateRefNumber();
    const timestamp = getTimestamp();
    const lat = location ? location.latitude.toFixed(6) : '';
    const lng = location ? location.longitude.toFixed(6) : '';
    const mapsLink = location ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` : '';

    try {
      let cloudinaryUrls: string[] = [];
      if (images.length > 0) {
        setStage('uploading-images'); setUploadPercent(0);
        toastInfo('Uploading photos…', 'Please wait while we upload your images.');
        cloudinaryUrls = await uploadImages(images.map(img => img.file), (pct) => setUploadPercent(pct));
        setUploadPercent(100);
      }

      const imageUrlsText = cloudinaryUrls.length > 0 ? cloudinaryUrls.join('\n') : 'No images uploaded';

      setStage('saving-record');
      toastInfo('Saving your request…');
      await submitToSheets({
        timestamp, referenceNumber: refNumber, customerName: snap.fullName,
        phoneNumber: `+91 ${snap.phoneNumber}`, serviceType: snap.serviceType,
        address: snap.address, landmark: snap.landmark, description: snap.description,
        latitude: lat || 'Not captured', longitude: lng || 'Not captured',
        mapsLink: mapsLink || 'Not available', imageUrls: imageUrlsText, status: 'New',
      });

      // Step 3: Send email + Telegram notification simultaneously
      setStage('sending-email');
      const ejServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const ejTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const ejPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      const telegramPayload = {
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
        timestamp,
      };

      await Promise.all([
        // EmailJS
        ejServiceId && ejServiceId !== 'YOUR_SERVICE_ID'
          ? emailjs.send(ejServiceId, ejTemplateId, {
              reference_number: refNumber, customer_name: snap.fullName,
              phone_number: `+91 ${snap.phoneNumber}`, service_type: snap.serviceType,
              address: snap.address, landmark: snap.landmark,
              description: snap.description, latitude: lat || 'Not captured',
              longitude: lng || 'Not captured', maps_link: mapsLink || 'Not available',
              cloudinary_image_urls: imageUrlsText, timestamp,
            }, ejPublicKey)
          : Promise.resolve(),
        // Telegram (errors swallowed inside the helper)
        sendTelegramNotification(telegramPayload),
      ]);

      setSuccessData({ refNumber, mapsLink, cloudinaryUrls, customerName: snap.fullName, phoneNumber: `+91 ${snap.phoneNumber}`, serviceType: snap.serviceType, description: snap.description });
      setStage('done');
      toastSuccess('Request submitted!', `Reference: ${refNumber}. We'll call you within 30 minutes.`);

      setForm({ fullName: '', phoneNumber: '', serviceType: '', description: '', address: '', landmark: '' });
      images.forEach(img => URL.revokeObjectURL(img.preview));
      setImages([]); setLocation(null); setLocStatus('idle'); setErrors({});

    } catch (err: any) {
      console.error('[Submit] Error:', err);
      setSubmitError(err?.message || 'Submission failed. Please try again.');
      setStage('error');
      toastError('Submission failed', 'Please try again or contact us on WhatsApp.');
    }
  };

  const isSubmitting = ['uploading-images', 'saving-record', 'sending-email'].includes(stage);

  const stageText: Record<SubmitStage, string> = {
    idle: 'Submit Service Request',
    'uploading-images': `Uploading photos… ${uploadPercent}%`,
    'saving-record': 'Saving your request…',
    'sending-email': 'Sending notification…',
    done: 'Done!',
    error: 'Try Again',
  };

  // ── Success Screen ────────────────────────────────────────────────────────────
  if (stage === 'done' && successData) {
    const { refNumber, mapsLink, cloudinaryUrls, customerName, phoneNumber, serviceType, description } = successData;
    const imageSection = cloudinaryUrls.length > 0 ? `\n\nImages (${cloudinaryUrls.length}):\n${cloudinaryUrls.join('\n')}` : '';
    const whatsappMessage = encodeURIComponent(
      `Hello Shree Devi Services,\n\nReference Number: ${refNumber}\nName: ${customerName}\nPhone: ${phoneNumber}\nService: ${serviceType}\nIssue: ${description}\nLocation: ${mapsLink || 'Not captured'}${imageSection}\n\nI submitted this request through your website.`
    );

    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #ECFDF5 50%, #F8FAFF 100%)' }}>
        <div className="max-w-md w-full">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl mb-6 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #2E7D32, #43A047)' }}>
              ✅
            </div>
            <h1 className="text-3xl font-black text-[#1A1A2E] mb-2">Request Submitted!</h1>
            <p className="text-gray-500 text-base">Our team will call you within <strong className="text-[#1565C0]">30 minutes</strong> to confirm your visit.</p>
          </motion.div>

          {/* Reference number */}
          <div className="rounded-3xl p-6 mb-5 text-center" style={{ background: 'white', border: '2px solid #86EFAC', boxShadow: '0 4px 24px rgba(46,125,50,0.1)' }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Your Reference Number</p>
            <div className="rounded-2xl py-4 px-6 mb-3" style={{ background: '#F0FDF4', border: '2px solid #86EFAC' }}>
              <p className="text-2xl font-black text-green-700 font-mono tracking-widest">{refNumber}</p>
            </div>
            <p className="text-xs text-gray-400">Save this number to track your request later</p>
          </div>

          {/* Checklist */}
          <div className="rounded-3xl p-5 mb-6 space-y-3" style={{ background: 'white', border: '2px solid #1565C015' }}>
            {[
              cloudinaryUrls.length > 0 && `${cloudinaryUrls.length} photo${cloudinaryUrls.length > 1 ? 's' : ''} uploaded to cloud`,
              'Request saved to service log',
              'Notification sent to our team',
              mapsLink ? 'Location shared with team' : null,
            ].filter(Boolean).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-medium">{item as string}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-3 mb-5">
            <a
              href={`https://wa.me/917337843016?text=${whatsappMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-white font-bold text-base active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              {WA_ICON}
              Continue on WhatsApp
            </a>
            <a
              href="tel:+917337843016"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #1565C0, #1E88E5)', color: 'white' }}
            >
              📞 Call: +91 73378 43016
            </a>
            {mapsLink && (
              <a href={mapsLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm text-[#1565C0] bg-blue-50 border border-blue-100 active:scale-95 transition-transform">
                📍 View Your Location on Maps
              </a>
            )}
          </div>

          <button onClick={() => { setStage('idle'); setSuccessData(null); }}
            className="w-full text-sm text-gray-400 hover:text-gray-600 underline transition-colors py-2">
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  // ── Main Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>

      {/* Hero header */}
      <div className="py-14 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0, #1976D2)' }}>
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="relative max-w-lg mx-auto">
          <span className="inline-block px-5 py-2 rounded-full text-sm font-bold text-white mb-5"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
            📋 Quick & Easy Booking
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Book a Service</h1>
          <p className="text-blue-100 text-base md:text-lg">
            Fill the form below — we'll call you within <strong className="text-white">30 minutes</strong> to confirm.
          </p>

          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mt-7">
            {['Info', 'Service', 'Location', 'Photos'].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)' }}>
                    {i + 1}
                  </div>
                  <span className="text-white/60 text-[10px] font-semibold hidden sm:block">{step}</span>
                </div>
                {i < 3 && <div className="w-6 h-0.5 mx-1 mb-4" style={{ background: 'rgba(255,255,255,0.25)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-28 md:pb-10">

        {/* Error banner */}
        <AnimatePresence>
          {stage === 'error' && submitError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-5 rounded-2xl flex items-start gap-3"
              style={{ background: '#FEF2F2', border: '2px solid #FCA5A5' }}>
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-black text-red-700 mb-1">Submission Failed</p>
                <p className="text-sm text-red-600 mb-2">{submitError}</p>
                <div className="flex gap-3">
                  <a href="https://wa.me/917337843016" target="_blank" rel="noopener noreferrer"
                    className="text-green-600 font-bold underline text-sm">WhatsApp us →</a>
                  <a href="tel:+917337843016" className="text-blue-600 font-bold underline text-sm">📞 Call</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Section 1: Personal Info ── */}
          <SectionCard num="1" title="Personal Information" emoji="👤">
            <div>
              <FieldLabel>Full Name *</FieldLabel>
              <input
                type="text" name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-4 rounded-2xl text-base font-medium border-2 transition-all outline-none focus:border-[#1565C0]"
                style={{ borderColor: errors.fullName ? '#EF4444' : '#E2E8F0', background: errors.fullName ? '#FEF2F2' : 'white' }}
              />
              <FieldError msg={errors.fullName} />
            </div>

            <div>
              <FieldLabel>📱 Phone Number *</FieldLabel>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm select-none">+91</span>
                <input
                  type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                  placeholder="10-digit mobile number" maxLength={10}
                  className="w-full pl-14 pr-4 py-4 rounded-2xl text-base font-medium border-2 transition-all outline-none focus:border-[#1565C0]"
                  style={{ borderColor: errors.phoneNumber ? '#EF4444' : '#E2E8F0', background: errors.phoneNumber ? '#FEF2F2' : 'white' }}
                />
              </div>
              <FieldError msg={errors.phoneNumber} />
            </div>
          </SectionCard>

          {/* ── Section 2: Service Type ── */}
          <SectionCard num="2" title="Service Details" emoji="🔧">
            <div>
              <FieldLabel>What service do you need? *</FieldLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SERVICE_TYPES.map(svc => (
                  <button
                    key={svc.label}
                    type="button"
                    onClick={() => { setForm(p => ({ ...p, serviceType: svc.label })); setErrors(p => ({ ...p, serviceType: '' })); }}
                    className="flex items-center gap-2.5 px-3 py-3 rounded-2xl text-sm font-semibold text-left transition-all active:scale-95"
                    style={{
                      background: form.serviceType === svc.label ? '#1565C0' : '#F8FAFF',
                      color: form.serviceType === svc.label ? 'white' : '#374151',
                      border: `2px solid ${form.serviceType === svc.label ? '#1565C0' : '#E2E8F0'}`,
                      boxShadow: form.serviceType === svc.label ? '0 4px 12px rgba(21,101,192,0.25)' : 'none',
                    }}
                  >
                    <span className="text-lg flex-shrink-0">{svc.emoji}</span>
                    <span className="leading-tight text-xs font-bold">{svc.label}</span>
                  </button>
                ))}
              </div>
              <FieldError msg={errors.serviceType} />
            </div>

            <div>
              <FieldLabel>Describe the Problem *</FieldLabel>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={4}
                placeholder="E.g. 'Power socket not working, sparks visible near kitchen…'"
                className="w-full px-4 py-4 rounded-2xl text-base font-medium border-2 transition-all outline-none focus:border-[#1565C0] resize-none"
                style={{ borderColor: errors.description ? '#EF4444' : '#E2E8F0', background: errors.description ? '#FEF2F2' : 'white' }}
              />
              <div className="flex justify-between mt-1">
                <FieldError msg={errors.description} />
                <span className="text-xs text-gray-400">{form.description.length} chars</span>
              </div>
            </div>


          </SectionCard>

          {/* ── Section 3: Location ── */}
          <SectionCard num="3" title="Location Details" emoji="📍">
            <div>
              <FieldLabel>Your Address *</FieldLabel>
              <input
                type="text" name="address" value={form.address} onChange={handleChange}
                placeholder="House no., Street, Area, City"
                className="w-full px-4 py-4 rounded-2xl text-base font-medium border-2 transition-all outline-none focus:border-[#1565C0]"
                style={{ borderColor: errors.address ? '#EF4444' : '#E2E8F0', background: errors.address ? '#FEF2F2' : 'white' }}
              />
              <FieldError msg={errors.address} />
            </div>

            <div>
              <FieldLabel>Landmark <span className="text-gray-400 font-normal">(Optional)</span></FieldLabel>
              <input
                type="text" name="landmark" value={form.landmark} onChange={handleChange}
                placeholder="Near temple, school, shop…"
                className="w-full px-4 py-4 rounded-2xl text-base font-medium border-2 border-gray-200 outline-none focus:border-[#1565C0] transition-all bg-white"
              />
            </div>

            {/* GPS Location */}
            <div className="rounded-2xl p-4" style={{ background: '#EFF6FF', border: '2px solid #BFDBFE' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#1565C0' }}>
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-gray-800 text-sm">Use My Current Location</p>
                  <p className="text-xs text-gray-500">Helps our team find you faster</p>
                </div>
              </div>

              {locStatus === 'idle' && (
                <button type="button" onClick={getLocation}
                  className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all active:scale-95 hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #1565C0, #1E88E5)' }}>
                  📍 Capture My Current Location
                </button>
              )}

              {locStatus === 'loading' && (
                <div className="text-center py-3">
                  <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[#1565C0] text-sm font-semibold">Getting your GPS location…</p>
                  {location && (
                    <p className="text-xs text-gray-400 mt-1">Refining… accuracy ~{Math.round(location.accuracy)} m</p>
                  )}
                  {!location && (
                    <p className="text-xs text-gray-400 mt-1">Please wait, this may take a few seconds</p>
                  )}
                </div>
              )}

              {locStatus === 'success' && location && (
                <div className="space-y-2">
                  <div
                    className="rounded-xl p-3"
                    style={{
                      background: location.accuracy <= 500 ? '#F0FDF4' : '#FFFBEB',
                      border: `1.5px solid ${location.accuracy <= 500 ? '#86EFAC' : '#FCD34D'}`,
                    }}
                  >
                    <p className={`font-black text-sm mb-1 ${location.accuracy <= 500 ? 'text-green-700' : 'text-amber-700'}`}>
                      {location.accuracy <= 500 ? '✅ Location Captured!' : '⚠️ Low Accuracy Location'}
                    </p>
                    <p className="text-xs text-gray-600 font-mono">
                      Lat: {location.latitude.toFixed(6)} · Lng: {location.longitude.toFixed(6)}
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${location.accuracy <= 200 ? 'text-green-600' : location.accuracy <= 500 ? 'text-amber-600' : 'text-red-500'}`}>
                      Accuracy: ~{Math.round(location.accuracy)} m
                      {location.accuracy > 500 && ' — please type your address for precision'}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline mt-1 inline-block font-semibold"
                    >
                      Verify on Google Maps ↗
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={getLocation}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: 'white', color: '#1565C0', border: '1.5px solid #BFDBFE' }}>
                      <RefreshCw className="w-3.5 h-3.5" /> Retry
                    </button>
                    <button type="button" onClick={clearLocation}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: 'white', color: '#EF4444', border: '1.5px solid #FECACA' }}>
                      <X className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              )}

              {locStatus === 'error' && (
                <div className="space-y-2">
                  <div className="rounded-xl p-3" style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5' }}>
                    <p className="text-red-600 text-sm font-semibold">⚠ {locError}</p>
                  </div>
                  <button type="button" onClick={getLocation}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: '#1565C0' }}>
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Section 4: Upload Photos ── */}
          <SectionCard num="4" title="Upload Photos" emoji="📷">
            <p className="text-sm text-gray-500 -mt-1">
              Photos help our technician arrive prepared. Optional — max 5 images, 10 MB each.
            </p>

            {/* Upload progress */}
            <AnimatePresence>
              {stage === 'uploading-images' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-600 font-semibold">
                    <span>Uploading to cloud…</span><span>{uploadPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #1565C0, #42A5F5)', width: `${uploadPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

                  {/* Camera option */}
                  <button
                    type="button"
                    onClick={() => { setShowMobileSheet(false); cameraInputRef.current?.click(); }}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-left transition-all active:scale-95"
                    style={{ background: '#EFF6FF', color: '#1565C0' }}
                  >
                    <span className="text-2xl">📷</span>
                    <div>
                      <p className="font-black text-sm">Take a Photo</p>
                      <p className="text-xs font-normal text-blue-400">Opens your device camera</p>
                    </div>
                  </button>

                  {/* Gallery option */}
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

            {/* Hidden inputs */}
            {/* Gallery input — no capture, lets user choose from gallery */}
            <input ref={fileInputRef} type="file" accept="image/*" multiple
              onChange={handleFileInput} className="hidden" disabled={images.length >= 5} />
            {/* Camera input — capture=environment forces camera on mobile */}
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment"
              onChange={handleFileInput} className="hidden" disabled={images.length >= 5} />

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => {
                if (images.length >= 5) return;
                if (isMobile()) { setShowMobileSheet(true); }
                else { fileInputRef.current?.click(); }
              }}
              className="rounded-2xl p-7 text-center cursor-pointer transition-all select-none"
              style={{
                border: `2px dashed ${isDragging ? '#1565C0' : '#CBD5E1'}`,
                background: isDragging ? '#EFF6FF' : images.length >= 5 ? '#F8FAFF' : '#FAFBFF',
                opacity: images.length >= 5 ? 0.6 : 1,
                cursor: images.length >= 5 ? 'not-allowed' : 'pointer',
              }}
            >
              <div className="text-4xl mb-2">{isDragging ? '📂' : '📷'}</div>
              <p className="font-bold text-gray-700 text-sm">
                {isDragging ? 'Drop here!' : images.length >= 5 ? 'Maximum 5 images reached' : 'Tap to take a photo or choose from gallery'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Camera · Gallery · Drag &amp; Drop · 10 MB max</p>
              <p className="text-xs text-[#1565C0] font-semibold mt-2">📱 Mobile: choose camera or gallery</p>
            </div>

            {/* Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={img.preview} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                    <Image src={img.preview} alt={`Photo ${i + 1}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 py-1 text-center text-white text-[10px] font-bold"
                      style={{ background: 'rgba(0,0,0,0.45)' }}>
                      {(img.file.size / 1024).toFixed(0)}KB
                    </div>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => { if (isMobile()) { setShowMobileSheet(true); } else { fileInputRef.current?.click(); } }}
                    className="aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center text-gray-400 hover:text-[#1565C0] transition-colors text-3xl"
                    style={{ borderColor: '#CBD5E1' }}
                  >
                    +
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400 text-center">{images.length}/5 photos · Stored in secure cloud</p>
          </SectionCard>

          {/* ── Submit ── */}
          <div className="space-y-4 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 rounded-2xl text-white font-black text-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl"
              style={{
                background: isSubmitting ? '#94A3B8' : 'linear-gradient(135deg, #F57C00, #FF9800)',
                boxShadow: isSubmitting ? 'none' : '0 8px 32px rgba(245,124,0,0.35)',
              }}
            >
              {isSubmitting && <span className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />}
              {!isSubmitting && <span>🚀</span>}
              {stageText[stage === 'error' ? 'idle' : stage]}
            </button>

            <p className="text-center text-xs text-gray-400">
              Free to submit · No payment required upfront · We'll call you to confirm
            </p>

            {/* Alternative contact */}
            <div className="rounded-2xl p-4 flex flex-col sm:flex-row gap-3" style={{ background: '#F8FAFF', border: '2px solid #E2E8F0' }}>
              <p className="text-sm font-semibold text-gray-600 sm:self-center flex-1">Prefer to contact directly?</p>
              <div className="flex gap-2">
                <a href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service."
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold flex-1 justify-center"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                  {WA_ICON} WhatsApp
                </a>
                <a href="tel:+917337843016"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[#1565C0] text-sm font-bold bg-blue-50 border border-blue-100 flex-1 justify-center">
                  <Phone className="w-4 h-4" /> Call
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
