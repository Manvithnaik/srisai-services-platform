'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const workImages = [
  '/work-images/IMG-20260612-WA0114.jpg',
  '/work-images/IMG-20260612-WA0115.jpg',
  '/work-images/IMG-20260612-WA0116.jpg',
  '/work-images/IMG-20260612-WA0117.jpg',
  '/work-images/IMG-20260612-WA0118.jpg',
  '/work-images/IMG-20260612-WA0119.jpg',
  '/work-images/IMG-20260612-WA0120.jpg',
  '/work-images/IMG-20260612-WA0121.jpg',
  '/work-images/IMG-20260612-WA0122.jpg',
  '/work-images/IMG-20260612-WA0123.jpg',
  '/work-images/IMG-20260612-WA0124.jpg',
  '/work-images/IMG-20260612-WA0125.jpg',
  '/work-images/IMG-20260612-WA0126.jpg',
  '/work-images/IMG-20260612-WA0127.jpg',
  '/work-images/IMG-20260612-WA0128.jpg',
  '/work-images/IMG-20260612-WA0129.jpg',
  '/work-images/IMG-20260612-WA0130.jpg',
  '/work-images/IMG-20260612-WA0131.jpg',
  '/work-images/IMG-20260612-WA0133.jpg',
  '/work-images/IMG-20260612-WA0134.jpg',
  '/work-images/IMG-20260612-WA0135.jpg',
  '/work-images/IMG-20260612-WA0136.jpg',
  '/work-images/IMG-20260612-WA0137.jpg',
  '/work-images/IMG-20260612-WA0138.jpg',
  '/work-images/IMG-20260612-WA0139.jpg',
  '/work-images/IMG-20260612-WA0140.jpg',
  '/work-images/IMG-20260612-WA0141.jpg',
  '/work-images/IMG-20260612-WA0142.jpg',
  '/work-images/IMG-20260612-WA0143.jpg',
  '/work-images/IMG-20260612-WA0144.jpg',
];

export default function Gallery() {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const total = workImages.length;

  // Auto-play
  useEffect(() => {
    if (isPaused || lightbox !== null) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), 3500);
    return () => clearInterval(t);
  }, [isPaused, lightbox, total]);

  const goTo = useCallback((i: number) => setCurrent((i + total) % total), [total]);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => i === null ? null : (i + 1) % total);
      if (e.key === 'ArrowLeft') setLightbox((i) => i === null ? null : (i - 1 + total) % total);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [lightbox, total]);

  return (
    <>
      <section id="gallery" className="py-32 bg-gradient-to-b from-white via-orange-50/20 to-gray-50 relative overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-40 right-0 w-80 h-80 bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-40 left-0 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full mb-4 border border-orange-200/50">
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent font-semibold text-sm">Real Project Photos</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 bg-clip-text text-transparent">Recent Work</span>
            </h2>
            <p className="text-xl text-gray-700 font-medium">{total} real completed projects by our expert team across Udupi district</p>
          </motion.div>

          {/* Main Slideshow */}
          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-[4/3] md:aspect-[16/9]">
              {workImages.map((src, i) => (
                <div
                  key={src}
                  className="absolute inset-0 transition-all duration-500"
                  style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
                >
                  <Image src={src} alt={`Shree Devi Services project ${i + 1}`} fill className="object-cover" priority={i === 0} sizes="(max-width: 768px) 100vw, 896px" />
                </div>
              ))}

              {/* Gradient + counter */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 z-20 text-white/90 text-sm font-medium backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">{current + 1} / {total}</div>

              {/* Zoom icon */}
              <button onClick={() => setLightbox(current)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition" aria-label="Fullscreen">
                <ZoomIn size={18} />
              </button>

              {/* Prev/Next */}
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 active:scale-95" aria-label="Previous">
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition hover:scale-110 active:scale-95" aria-label="Next">
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 justify-center scrollbar-hide">
              {workImages.slice(Math.max(0, current - 3), current + 7).map((src, idx) => {
                const realIdx = Math.max(0, current - 3) + idx;
                return (
                  <button key={src} onClick={() => goTo(realIdx)} className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${realIdx === current ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-90'}`}>
                    <Image src={src} alt="" width={64} height={48} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {Array.from({ length: Math.min(total, 10) }).map((_, i) => {
                const idx = Math.floor((i / 10) * total);
                return (
                  <button key={i} onClick={() => goTo(idx)} className={`rounded-full transition-all duration-300 ${Math.abs(current - idx) < total / 10 && i === Math.floor((current / total) * 10) ? 'w-6 h-2.5 bg-blue-600' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`} />
                );
              })}
            </div>
          </div>

          {/* View Full Gallery */}
          <div className="text-center mt-10">
            <Link href="/gallery" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              View Full Gallery
            </Link>
            <p className="text-sm text-gray-400 mt-3">{total} completed project photos — tap to explore</p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition" onClick={() => setLightbox(null)}>
              <X size={22} />
            </button>
            <div className="absolute top-4 left-4 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">{lightbox + 1} / {total}</div>
            <button className="absolute left-3 md:left-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition hover:scale-110" onClick={(e) => { e.stopPropagation(); setLightbox((i) => i === null ? null : (i - 1 + total) % total); }}>
              <ChevronLeft size={24} />
            </button>
            <div className="relative max-w-5xl max-h-[85vh] w-full mx-16 md:mx-24" onClick={(e) => e.stopPropagation()}>
              <Image src={workImages[lightbox]} alt={`Project ${lightbox + 1}`} width={1200} height={900} className="w-full h-full object-contain rounded-lg max-h-[85vh]" priority />
            </div>
            <button className="absolute right-3 md:right-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition hover:scale-110" onClick={(e) => { e.stopPropagation(); setLightbox((i) => i === null ? null : (i + 1) % total); }}>
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
