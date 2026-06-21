'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ramesh Shetty',
    location: 'Shankarpura, Udupi',
    rating: 5,
    text: 'Excellent service! The electrician came the same day and fixed our power failure issue in under 2 hours. Very professional and clean work.',
    service: 'Electrical Repair',
  },
  {
    name: 'Savitha Rao',
    location: 'Manipal',
    rating: 5,
    text: 'Best plumbers in Udupi. Fixed our leaking pipe without any mess. Very punctual and polite. Highly recommend Shree Devi Services!',
    service: 'Plumbing Repair',
  },
  {
    name: 'Kiran Prabhu',
    location: 'Brahmavara',
    rating: 5,
    text: 'Called them for an emergency at night — they arrived within 30 minutes! Professional, affordable, and very responsive on WhatsApp.',
    service: 'Emergency Repair',
  },
  {
    name: 'Deepa Nayak',
    location: 'Kundapura',
    rating: 4,
    text: 'AC was not cooling for weeks. They serviced it quickly and the cooling is back to normal. Great service, will definitely call again.',
    service: 'AC Servicing',
  },
  {
    name: 'Suresh Kamath',
    location: 'Kaup',
    rating: 5,
    text: 'Had bathroom fitting done. The team was very skilled and completed the work neatly. Neighbours have already asked me for their contact!',
    service: 'Bathroom Fitting',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const next = () => { setCurrent((prev) => (prev + 1) % testimonials.length); setAutoPlay(false); };
  const prev = () => { setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length); setAutoPlay(false); };

  return (
    <section className="py-32 bg-gradient-to-b from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 left-0 w-72 h-72 bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-20 right-0 w-72 h-72 bg-blue-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <motion.div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-blue-100 rounded-full mb-4 border border-orange-200/50">
            <span className="bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent font-semibold text-sm">Real Success Stories</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">What Customers Say</span>
          </h2>
          <p className="text-xl text-gray-700 font-medium">Join over 500+ satisfied families across Udupi district using Shree Devi Services</p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl p-8 md:p-12 shadow-2xl border border-blue-100/50 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-blue-200/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative flex items-start gap-6 mb-8">
                <motion.div whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.5 }} className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg border-2 border-blue-400/30">
                  {testimonials[current].name[0]}
                </motion.div>
                <div className="flex-1 pt-1">
                  <h4 className="text-2xl font-bold text-gray-900">{testimonials[current].name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm font-semibold text-gray-600">📍 {testimonials[current].location}</p>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">{testimonials[current].service}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <motion.div key={i} initial={{ rotate: 0, scale: 0.8 }} animate={{ rotate: 360, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                    <Star size={24} className="fill-amber-400 text-amber-400 drop-shadow-md" />
                  </motion.div>
                ))}
              </div>
              <p className="text-lg text-gray-700 leading-relaxed italic font-medium">"{testimonials[current].text}"</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-8">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prev} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <ChevronLeft size={24} />
            </motion.button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button key={index} onClick={() => { setCurrent(index); setAutoPlay(false); }} className={`h-3 rounded-full transition-all ${index === current ? 'bg-blue-600 w-8' : 'bg-gray-300 w-3'}`} whileHover={{ scale: 1.2 }} />
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={next} className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-200 text-center">
          {[
            { stat: '4.8★', label: 'Average Rating' },
            { stat: '500+', label: 'Happy Customers' },
            { stat: '1K+', label: 'Services Completed' },
          ].map((item, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
              <p className="text-3xl font-bold text-blue-600">{item.stat}</p>
              <p className="text-gray-600 mt-2">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
