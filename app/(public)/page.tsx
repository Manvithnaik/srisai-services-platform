import { Hero } from '@/components/public/Hero';
import { Services } from '@/components/public/Services';
import { WhyChooseUs } from '@/components/public/WhyChooseUs';
import { RecentWork } from '@/components/RecentWork';
import { HowItWorks } from '@/components/HowItWorks';
import { AreasWeServe } from '@/components/AreasWeServe';

export const metadata = {
  title: 'Home | Shree Devi Services',
  description: 'Trusted electrical, plumbing, and maintenance services in Shankarpura, Udupi, Karnataka. Fast, reliable, same-day support.',
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Services />
      <HowItWorks />
      <RecentWork />
      <WhyChooseUs />
      <AreasWeServe />
    </div>
  );
}
