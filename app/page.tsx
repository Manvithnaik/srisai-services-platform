import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { Hero } from '@/components/public/Hero';
import { Services } from '@/components/public/Services';
import { WhyChooseUs } from '@/components/public/WhyChooseUs';
import { MeetTheTeam } from '@/components/public/MeetTheTeam';
import { RecentWork } from '@/components/RecentWork';
import { HowItWorks } from '@/components/HowItWorks';
import { AreasWeServe } from '@/components/AreasWeServe';
import Testimonials from '@/components/Testimonials';

export const metadata = {
  title: 'Shree Devi Services — Electrical & Plumbing in Udupi, Shankarpura',
  description: 'Trusted home maintenance experts in Shankarpura, Udupi. Electricians, plumbers, AC service & appliance repair. Same-day service, 24/7 emergency support. Book online!',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <HowItWorks />
        <RecentWork />
        <WhyChooseUs />
        <MeetTheTeam />
        <Testimonials />
        <AreasWeServe />
      </main>
      <Footer />
      <MobileStickyBar />
    </div>
  );
}
