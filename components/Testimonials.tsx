'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ramesh Shetty',
    location: 'Shankarpura, Udupi',
    rating: 5,
    text: 'Excellent service! The electrician came the same day and fixed our power failure in under 2 hours. Very professional and clean work.',
    service: 'Electrical Repair',
    avatarColor: '#1565C0',
  },
  {
    name: 'Savitha Rao',
    location: 'Manipal',
    rating: 5,
    text: 'Best plumbers in Udupi. Fixed our leaking pipe without any mess. Very punctual and polite. Highly recommend Shree Devi Services!',
    service: 'Plumbing Repair',
    avatarColor: '#7B1FA2',
  },
  {
    name: 'Kiran Prabhu',
    location: 'Brahmavara',
    rating: 5,
    text: 'Called them for an emergency at night — they arrived within 30 minutes! Professional, affordable, and very responsive on WhatsApp.',
    service: 'Emergency Repair',
    avatarColor: '#BF360C',
  },
  {
    name: 'Deepa Nayak',
    location: 'Kundapura',
    rating: 4,
    text: 'AC was not cooling for weeks. They serviced it quickly and the cooling is back to normal. Great service, will definitely call again.',
    service: 'AC Servicing',
    avatarColor: '#00838F',
  },
  {
    name: 'Suresh Kamath',
    location: 'Kaup',
    rating: 5,
    text: 'Had bathroom fitting done. The team was very skilled and completed the work neatly. Neighbours have already asked me for their contact!',
    service: 'Bathroom Fitting',
    avatarColor: '#2E7D32',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [autoPlay]);

  const next = () => { setCurrent(p => (p + 1) % testimonials.length); setAutoPlay(false); };
  const prev = () => { setCurrent(p => (p - 1 + testimonials.length) % testimonials.length); setAutoPlay(false); };

  const t = testimonials[current];

  return (
    <section className="section-pad" style={{ background: 'linear-gradient(180deg, #F8FAFF 0%, white 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4 inline-flex">⭐ Customer Stories</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] mb-4 leading-tight">
            What Our Customers <span className="gradient-text-orange">Say About Us</span>
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">Real reviews from real people in our community</p>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.97 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="rounded-3xl p-7 md:p-10"
              style={{
                background: 'white',
                boxShadow: '0 8px 48px rgba(21,101,192,0.1)',
                border: '2px solid rgba(21,101,192,0.08)',
              }}
            >
              {/* Quote mark */}
              <div className="text-7xl font-black text-[#1565C0] opacity-10 leading-none mb-2 select-none">"</div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    fill={i < t.rating ? '#F59E0B' : 'none'}
                    stroke={i < t.rating ? '#F59E0B' : '#D1D5DB'}
                    strokeWidth={2}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium mb-8">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.avatarColor}, ${t.avatarColor}AA)` }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-black text-[#1A1A2E] text-base">{t.name}</p>
                  <p className="text-gray-400 text-sm">📍 {t.location}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: '#E3F2FD', color: '#1565C0' }}
                  >
                    {t.service}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: '#1565C0', color: 'white' }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setAutoPlay(false); }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 28 : 10,
                    height: 10,
                    background: i === current ? '#1565C0' : '#CBD5E1',
                  }}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: '#1565C0', color: 'white' }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-5 mt-10 pt-8 border-t border-gray-100"
        >
          {[
            { stat: '4.8★', label: 'Average Rating', color: '#F59E0B' },
            { stat: '500+', label: 'Happy Customers', color: '#1565C0' },
            { stat: '1K+', label: 'Services Done', color: '#2E7D32' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl md:text-3xl font-black" style={{ color: item.color }}>{item.stat}</p>
              <p className="text-gray-500 text-xs md:text-sm mt-1 font-semibold">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
