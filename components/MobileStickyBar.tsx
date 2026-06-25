'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const WA_ICON = (
  <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
  </svg>
);

export function MobileStickyBar() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 38, delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-bottom"
    >
      {/* Soft shadow separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="grid grid-cols-3" style={{ background: 'white', boxShadow: '0 -4px 24px rgba(21,101,192,0.12)' }}>

        {/* WhatsApp */}
        <a
          href="https://wa.me/918431759374?text=Hello%20Shree%20Devi%20Services%2C%20I%20need%20help%20with%20a%20service."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-3.5 gap-1 active:opacity-75 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          aria-label="Chat on WhatsApp"
        >
          {WA_ICON}
          <span className="text-white text-[11px] font-black">WhatsApp</span>
        </a>

        {/* Call Now */}
        <a
          href="tel:+918431759374"
          className="flex flex-col items-center justify-center py-3.5 gap-1 active:opacity-75 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #1565C0, #1E88E5)' }}
          aria-label="Call us now"
        >
          <Phone className="w-5 h-5 text-white" />
          <span className="text-white text-[11px] font-black">Call Now</span>
        </a>

        {/* Book Service */}
        <a
          href="/file-complaint"
          className="flex flex-col items-center justify-center py-3.5 gap-1 active:opacity-75 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #F57C00, #FF9800)' }}
          aria-label="Book a service"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-white text-[11px] font-black">Book Service</span>
        </a>
      </div>
    </motion.div>
  );
}
