'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// All 40 work images from /public/work-images/
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const total = workImages.length;

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((index + total) % total);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  // Touch/swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  // Show 3 pagination dots around current
  const visibleDots = () => {
    const dots: number[] = [];
    const range = 4;
    for (let i = Math.max(0, current - range); i <= Math.min(total - 1, current + range); i++) {
      dots.push(i);
    }
    return dots;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Our Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Recent Work
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Real projects completed by our expert team. Quality craftsmanship you can trust.
          </p>
        </div>

        {/* Slideshow Container */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Main Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-[4/3] md:aspect-[16/9]">
            {/* Show current + adjacent for smooth transition */}
            {workImages.map((src, i) => (
              <div
                key={src}
                className="absolute inset-0 transition-all duration-500 ease-in-out"
                style={{
                  opacity: i === current ? 1 : 0,
                  transform: `scale(${i === current ? 1 : 1.05})`,
                  zIndex: i === current ? 1 : 0,
                }}
              >
                <Image
                  src={src}
                  alt={`Shree Devi Services work ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            ))}

            {/* Gradient overlay bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent z-10" />

            {/* Image counter */}
            <div className="absolute bottom-4 left-4 z-20 text-white/90 text-sm font-medium backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
              {current + 1} / {total}
            </div>

            {/* Prev/Next Buttons */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {workImages.slice(Math.max(0, current - 3), current + 7).map((src, idx) => {
              const realIdx = Math.max(0, current - 3) + idx;
              return (
                <button
                  key={src}
                  onClick={() => goTo(realIdx)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    realIdx === current ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${realIdx + 1}`}
                    width={64}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {current > 4 && <span className="text-gray-300 text-xs">•••</span>}
            {visibleDots().map((i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2.5 bg-blue-600'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
            {current < total - 5 && <span className="text-gray-300 text-xs">•••</span>}
          </div>
        </div>

        {/* View Full Gallery Button */}
        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Full Gallery
          </Link>
          <p className="text-sm text-gray-400 mt-3">{total} completed project photos</p>
        </div>
      </div>
    </section>
  );
}
