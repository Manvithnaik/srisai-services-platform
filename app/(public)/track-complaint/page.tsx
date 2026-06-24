'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Clock, AlertCircle, XCircle, MapPin, Phone, Wrench, Calendar, FileText, ChevronRight } from 'lucide-react';

type RequestData = {
  referenceNumber: string;
  timestamp: string;
  customerName: string;
  phoneNumber: string;
  serviceType: string;
  address: string;
  landmark: string;
  description: string;
  mapsLink: string;
  status: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; step: number }> = {
  'New': {
    label: 'Request Received',
    color: '#1565C0',
    bg: '#E3F2FD',
    border: '#90CAF9',
    icon: <Clock className="w-5 h-5" />,
    step: 1,
  },
  'In Progress': {
    label: 'Work In Progress',
    color: '#E65100',
    bg: '#FFF3E0',
    border: '#FFCC80',
    icon: <Wrench className="w-5 h-5" />,
    step: 2,
  },
  'Completed': {
    label: 'Completed',
    color: '#2E7D32',
    bg: '#E8F5E9',
    border: '#A5D6A7',
    icon: <CheckCircle className="w-5 h-5" />,
    step: 3,
  },
  'Cancelled': {
    label: 'Cancelled',
    color: '#C62828',
    bg: '#FFEBEE',
    border: '#EF9A9A',
    icon: <XCircle className="w-5 h-5" />,
    step: 0,
  },
};

const STEPS = ['New', 'In Progress', 'Completed'];

export default function TrackComplaintPage() {
  const [refInput, setRefInput]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<RequestData | null>(null);
  const [notFound, setNotFound]   = useState(false);
  const [error, setError]         = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const ref = refInput.trim().toUpperCase();
    if (!ref) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);
    setError('');

    try {
      const res  = await fetch(`/api/track?ref=${encodeURIComponent(ref)}`);
      const data = await res.json();

      if (data.success) {
        setResult(data as RequestData);
      } else {
        setNotFound(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cfg    = result ? (STATUS_CONFIG[result.status] ?? STATUS_CONFIG['New']) : null;
  const step   = cfg?.step ?? 1;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="relative overflow-hidden py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #1A3A5C 0%, #1565C0 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              🔍 Live Status Tracking
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Track Your Request</h1>
            <p className="text-blue-200 text-lg">Enter your reference number to see real-time status updates</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Search box */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 md:p-8"
          style={{ background: 'var(--card)', border: '2px solid var(--border)', boxShadow: '0 4px 32px rgba(21,101,192,0.08)' }}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={refInput}
                onChange={e => setRefInput(e.target.value)}
                placeholder="e.g. SDS-20260624-2300"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-base font-semibold outline-none transition-all"
                style={{
                  background: 'var(--background)',
                  border: '2px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !refInput.trim()}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1565C0, #1E88E5)' }}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Track <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </motion.div>

        {/* Not found */}
        <AnimatePresence>
          {notFound && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: '#FFF3E0', border: '2px solid #FFCC80' }}>
              <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#E65100' }} />
              <div>
                <p className="font-bold" style={{ color: '#E65100' }}>Reference not found</p>
                <p className="text-sm text-orange-700">Double-check your reference number (e.g. SDS-20260624-2300) and try again.</p>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: '#FFEBEE', border: '2px solid #EF9A9A' }}>
              <XCircle className="w-6 h-6 flex-shrink-0 text-red-600" />
              <p className="font-semibold text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result card */}
        <AnimatePresence>
          {result && cfg && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-3xl overflow-hidden"
              style={{ border: `2px solid ${cfg.border}`, boxShadow: `0 8px 40px ${cfg.color}18` }}>

              {/* Status banner */}
              <div className="px-8 py-5 flex items-center justify-between flex-wrap gap-3"
                style={{ background: cfg.bg, borderBottom: `2px solid ${cfg.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ background: cfg.color }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.color }}>Current Status</p>
                    <p className="text-xl font-black" style={{ color: cfg.color }}>{cfg.label}</p>
                  </div>
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-wider text-white"
                  style={{ background: cfg.color }}>
                  {result.referenceNumber}
                </span>
              </div>

              {/* Progress bar (only for non-cancelled) */}
              {result.status !== 'Cancelled' && (
                <div className="px-8 py-5" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-0">
                    {STEPS.map((s, i) => {
                      const done    = i < step;
                      const active  = i === step - 1;
                      const sCfg   = STATUS_CONFIG[s];
                      return (
                        <div key={s} className="flex items-center flex-1">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all"
                              style={{
                                background: done ? sCfg.color : 'var(--muted)',
                                color: done ? '#fff' : 'var(--muted-foreground)',
                                boxShadow: active ? `0 0 0 4px ${sCfg.color}30` : 'none',
                              }}>
                              {done ? '✓' : i + 1}
                            </div>
                            <span className="text-xs font-semibold hidden sm:block"
                              style={{ color: done ? sCfg.color : 'var(--muted-foreground)' }}>
                              {s}
                            </span>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className="flex-1 h-1.5 mx-1 rounded-full transition-all"
                              style={{ background: i < step - 1 ? STATUS_CONFIG[STEPS[i + 1]].color : 'var(--muted)' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Details grid */}
              <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ background: 'var(--card)' }}>
                {[
                  { icon: <FileText className="w-4 h-4" />, label: 'Service Type', value: result.serviceType },
                  { icon: <Calendar className="w-4 h-4" />,  label: 'Submitted On', value: result.timestamp },
                  { icon: <MapPin className="w-4 h-4" />,    label: 'Address',      value: result.address + (result.landmark ? ` · ${result.landmark}` : '') },
                  { icon: <Phone className="w-4 h-4" />,     label: 'Phone',        value: result.phoneNumber },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: cfg.color }}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
                      <p className="font-semibold text-sm break-words" style={{ color: 'var(--foreground)' }}>{value || '—'}</p>
                    </div>
                  </div>
                ))}

                {result.description && (
                  <div className="sm:col-span-2 flex items-start gap-3 p-4 rounded-2xl"
                    style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: cfg.color }}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5">Problem Description</p>
                      <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{result.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Maps link */}
              {result.mapsLink && result.mapsLink !== 'Not available' && (
                <div className="px-8 py-4" style={{ background: 'var(--background)', borderTop: '1px solid var(--border)' }}>
                  <a href={result.mapsLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
                    style={{ color: cfg.color }}>
                    <MapPin className="w-4 h-4" /> View Location on Google Maps
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help note */}
        {!result && !loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Your reference number was shown on screen and sent via email after submitting your service request.<br />
            It looks like <strong>SDS-YYYYMMDD-HHMM</strong> (e.g. SDS-20260624-2300).
          </motion.p>
        )}
      </div>
    </div>
  );
}
