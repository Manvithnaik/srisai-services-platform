import { Hero } from '@/components/public/Hero';
import { Services } from '@/components/public/Services';
import { WhyChooseUs } from '@/components/public/WhyChooseUs';
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
    <div>
      <Hero />
      <Services />
      <HowItWorks />
      <RecentWork />
      <WhyChooseUs />
      <Testimonials />
      <AreasWeServe />
    </div>
  );
}
