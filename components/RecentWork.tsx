'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

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
  '/work-images/IMG-20260612-WA0145.jpg',
  '/work-images/IMG-20260612-WA0146.jpg',
  '/work-images/IMG-20260612-WA0147.jpg',
  '/work-images/IMG-20260612-WA0148.jpg',
  '/work-images/IMG-20260612-WA0149.jpg',
  '/work-images/IMG-20260612-WA0150.jpg',
  '/work-images/IMG-20260612-WA0151.jpg',
  '/work-images/IMG-20260612-WA0152.jpg',
  '/work-images/IMG-20260612-WA0153.jpg',
  '/work-images/IMG-20260612-WA0154.jpg',
];

export function RecentWork() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(new Set([0]));
  const touchStart = useRef<number>(0);
  const total = workImages.length;

  const goTo = useCallback((idx: number) => {
    const next = (idx + total) % total;
    setCurrent(next);
    setLoaded(prev => new Set([...prev, next, (next + 1) % total]));
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => goTo(current + 1), 4000);
    return () => clearInterval(t);
  }, [current, isPaused, goTo]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); setIsPaused(true); }
  };

  // Visible thumbnail range
  const thumbStart = Math.max(0, Math.min(current - 3, total - 7));
  const thumbRange = workImages.slice(thumbStart, thumbStart + 7);

  return (
    <section className="section-pad" style={{ background: 'linear-gradient(180deg, #F8FAFF 0%, #EEF2FF 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="section-badge mb-4 inline-flex">📸 Our Portfolio</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A1A2E] mb-3 leading-tight">
            Real Work. <span className="gradient-text-blue">Real Results.</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Photos from actual jobs completed by our team. Quality you can see.
          </p>
        </motion.div>

        {/* Slideshow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900"
          style={{ aspectRatio: '16/9' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Images */}
          {workImages.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              {(loaded.has(i) || i === current) && (
                <Image
                  src={src}
                  alt={`Shree Devi Services completed work ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              )}
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />

          {/* Counter badge */}
          <div className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full text-white text-sm font-bold"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            📷 {current + 1} / {total}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
            <motion.div
              className="h-full bg-white"
              key={current}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: isPaused ? 0 : 4, ease: 'linear' }}
            />
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => { prev(); setIsPaused(true); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { next(); setIsPaused(true); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Thumbnail strip */}
        <div className="flex gap-2.5 mt-4 justify-center overflow-x-auto scrollbar-hide pb-1">
          {thumbRange.map((src, idx) => {
            const realIdx = thumbStart + idx;
            return (
              <button
                key={src}
                onClick={() => { goTo(realIdx); setIsPaused(true); }}
                className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
                style={{
                  width: 72, height: 52,
                  outline: realIdx === current ? '3px solid #1565C0' : '3px solid transparent',
                  outlineOffset: '2px',
                  opacity: realIdx === current ? 1 : 0.6,
                  transform: realIdx === current ? 'scale(1.05)' : 'scale(1)',
                }}
                aria-label={`Go to photo ${realIdx + 1}`}
              >
                <Image src={src} alt={`Thumbnail ${realIdx + 1}`} width={72} height={52} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>

        {/* View Gallery CTA */}
        <div className="text-center mt-8">
          <Link href="/gallery" className="btn-primary inline-flex gap-2 text-base">
            <Images className="w-5 h-5" />
            View All {total} Photos
          </Link>
          <p className="text-gray-400 text-sm mt-2">Real photos from completed projects</p>
        </div>
      </div>
    </section>
  );
}
