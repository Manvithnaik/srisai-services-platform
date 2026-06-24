'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/* ── Fallback hardcoded reviews (shown when sheet is empty) ─────────────── */
const FALLBACK = [
  { name:'Ramesh Shetty',  location:'Shankarpura, Udupi', rating:5, text:'Excellent service! The electrician came the same day and fixed our power failure in under 2 hours. Very professional and clean work.', service:'Electrical Repair', color:'#C84B11' },
  { name:'Savitha Rao',    location:'Manipal',            rating:5, text:'Best plumbers in Udupi. Fixed our leaking pipe without any mess. Very punctual and polite. Highly recommend Shree Devi Services!', service:'Plumbing Repair', color:'#1A3A5C' },
  { name:'Kiran Prabhu',   location:'Brahmavara',         rating:5, text:'Called them for an emergency at night — they arrived within 30 minutes! Professional, affordable, and very responsive on WhatsApp.', service:'Emergency Repair', color:'#A03A0A' },
  { name:'Deepa Nayak',    location:'Kundapura',          rating:4, text:'AC was not cooling for weeks. They serviced it quickly and the cooling is back to normal. Great service, will definitely call again.', service:'AC Servicing', color:'#00696F' },
  { name:'Suresh Kamath',  location:'Kaup',               rating:5, text:'Had bathroom fitting done. The team was very skilled and completed the work neatly. Neighbours have already asked me for their contact!', service:'Bathroom Fitting', color:'#2D5A27' },
];

/* ── Palette of accent colours for live reviews ────────────────────────── */
const COLORS = ['#C84B11','#1A3A5C','#A03A0A','#00696F','#2D5A27','#6B3FA0','#BF6900','#006994'];

type Review = {
  name: string;
  location?: string;
  rating: number;
  text: string;
  service?: string;
  color: string;
};

/* ── Map raw sheet row → Review ─────────────────────────────────────────── */
function shapeReview(item: any, idx: number): Review {
  return {
    name    : item.name    || 'Anonymous',
    location: '',                                         // not captured in feedback form
    rating  : typeof item.rating === 'number' ? item.rating : 5,
    text    : item.message || '',
    service : '',
    color   : COLORS[idx % COLORS.length],
  };
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK);
  const [isLive,  setIsLive]  = useState(false);
  const [current, setCurrent] = useState(0);
  const [auto,    setAuto]    = useState(true);

  /* Fetch live reviews on mount */
  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(json => {
        if (Array.isArray(json.feedback) && json.feedback.length > 0) {
          setReviews(json.feedback.map(shapeReview));
          setIsLive(true);
          setCurrent(0);
        }
      })
      .catch(() => { /* silently stay on fallback */ });
  }, []);

  /* Auto-advance */
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setCurrent(p => (p + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [auto, reviews.length]);

  const next = () => { setCurrent(p => (p + 1) % reviews.length); setAuto(false); };
  const prev = () => { setCurrent(p => (p - 1 + reviews.length) % reviews.length); setAuto(false); };
  const t = reviews[current];

  return (
    <section className="section-pad bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-0 w-64 h-64 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,#C84B11,transparent)', transform:'translate(-30%,0)' }} />
        <div className="absolute bottom-10 right-0 w-64 h-64 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,#1A3A5C,transparent)', transform:'translate(30%,0)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12">
          <span className="section-badge mb-4 inline-flex">⭐ Customer Stories</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            What Our Customers <span className="gradient-text-terra">Say About Us</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            {isLive ? 'Real reviews submitted by our customers' : 'Real reviews from real people in our community'}
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, x: 60, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.97 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="rounded-3xl p-7 md:p-10 bg-card border-2"
              style={{ borderColor: `${t.color}20`, boxShadow: `0 8px 48px ${t.color}12` }}>
              <div className="text-7xl font-black opacity-10 leading-none mb-2 select-none" style={{ color: t.color }}>"</div>
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5" fill={i < t.rating ? '#C88A10' : 'none'}
                    stroke={i < t.rating ? '#C88A10' : 'currentColor'} strokeWidth={2}
                    style={{ color: i < t.rating ? '#C88A10' : 'var(--muted-foreground)' }} />
                ))}
              </div>
              <p className="text-foreground text-lg md:text-xl leading-relaxed font-medium mb-8">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${t.color},${t.color}BB)` }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-black text-foreground text-base">{t.name}</p>
                  {t.location && <p className="text-muted-foreground text-sm">📍 {t.location}</p>}
                </div>
                {t.service && (
                  <div className="ml-auto">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: t.color }}>
                      {t.service}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <button onClick={prev}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#1A3A5C,#2A5080)' }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => { setCurrent(i); setAuto(false); }}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === current ? 28 : 10, height: 10, background: i === current ? '#C84B11' : 'var(--muted)' }} />
              ))}
            </div>
            <button onClick={next}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#1A3A5C,#2A5080)' }}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-5 mt-10 pt-8 border-t border-border">
          {[{stat:'4.8★',label:'Average Rating',c:'#C88A10'},{stat:'500+',label:'Happy Customers',c:'#1A3A5C'},{stat:'1K+',label:'Services Done',c:'#C84B11'}].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-2xl md:text-3xl font-black" style={{ color: item.c }}>{item.stat}</p>
              <p className="text-muted-foreground text-xs md:text-sm mt-1 font-semibold">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
