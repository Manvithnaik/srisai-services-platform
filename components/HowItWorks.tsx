'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    icon: '📋',
    step: '01',
    title: 'Report the Issue',
    description: 'Fill our quick service form or WhatsApp us. Describe the problem and upload photos if needed.',
    color: 'from-blue-500 to-blue-700',
  },
  {
    icon: '📞',
    step: '02',
    title: 'Technician Contacts You',
    description: 'Our expert calls you within 30 minutes to confirm details, timing, and give a cost estimate.',
    color: 'from-orange-400 to-orange-600',
  },
  {
    icon: '🏠',
    step: '03',
    title: 'Service Visit',
    description: 'Our verified technician arrives at your location at the scheduled time with all tools ready.',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: '✅',
    step: '04',
    title: 'Problem Solved',
    description: 'Work completed to your satisfaction. We clean up and you verify before we leave.',
    color: 'from-purple-500 to-purple-700',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full mb-4 border border-blue-200/50">
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent font-semibold text-sm">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 bg-clip-text text-transparent">How It Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Getting your issue fixed is just 4 simple steps away</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-green-200 -translate-y-1/2" style={{ top: '4rem' }} />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 text-center group"
            >
              {/* Step number bubble */}
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform relative z-10`}>
                <span className="text-2xl">{step.icon}</span>
              </div>

              <div className={`inline-block px-3 py-0.5 rounded-full bg-gradient-to-r ${step.color} text-white text-xs font-black mb-3`}>
                STEP {step.step}
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>

              {/* Arrow (except last) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-16 text-gray-300 text-2xl z-20">→</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/file-complaint"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
