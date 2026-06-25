'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const allImages = [
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

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % allImages.length));
  }, []);
  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + allImages.length) % allImages.length));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'ArrowLeft') lightboxPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, closeLightbox, lightboxNext, lightboxPrev]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const onTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? lightboxNext() : lightboxPrev();
    }
  };

  const markLoaded = (i: number) => setLoaded((prev) => new Set(prev).add(i));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-4">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4">Project Gallery</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {allImages.length} real completed projects by Shree Devi Services. 
              Electrical, plumbing, and maintenance work across Udupi district.
            </p>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {allImages.map((src, i) => (
              <div
                key={src}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => openLightbox(i)}
              >
                <div className={`bg-gray-200 transition-opacity duration-300 ${loaded.has(i) ? 'opacity-100' : 'opacity-50'}`}>
                  <Image
                    src={src}
                    alt={`Shree Devi Services project ${i + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    onLoad={() => markLoaded(i)}
                    loading={i < 8 ? 'eager' : 'lazy'}
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div className="text-white">
                    <p className="text-sm font-semibold">Project #{i + 1}</p>
                    <p className="text-xs text-white/80">Click to view</p>
                  </div>
                  <div className="ml-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need a Similar Service?</h3>
            <p className="text-gray-600 mb-6">Our team is ready to help with any electrical or plumbing issue.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/file-complaint"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all hover:scale-105"
              >
                Book a Service
              </a>
              <a
                href="https://wa.me/918431759374?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {allImages.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-3 md:left-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition hover:scale-110"
            onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-16 md:mx-24"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex]}
              alt={`Project ${lightboxIndex + 1}`}
              width={1200}
              height={900}
              className="w-full h-full object-contain rounded-lg max-h-[85vh]"
              priority
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-3 md:right-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition hover:scale-110"
            onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail strip at bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex gap-1.5 overflow-x-auto px-4 justify-center">
            {allImages.slice(Math.max(0, lightboxIndex - 4), lightboxIndex + 5).map((src, idx) => {
              const realIdx = Math.max(0, lightboxIndex - 4) + idx;
              return (
                <button
                  key={src}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(realIdx); }}
                  className={`flex-shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all ${
                    realIdx === lightboxIndex ? 'border-blue-400 scale-110' : 'border-white/20 opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image src={src} alt="" width={48} height={36} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
