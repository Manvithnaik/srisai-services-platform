'use client';

import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import { HowItWorks } from '@/components/HowItWorks';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import { AreasWeServe } from '@/components/AreasWeServe';
import Footer from '@/components/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-16 md:pb-0">
      <Navbar />
      {/* ★ Booking form is the FIRST thing users see ★ */}
      <BookingForm />
      <Hero />
      <Services />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <AreasWeServe />
      <Footer />
      <MobileStickyBar />
    </main>
  );
}
