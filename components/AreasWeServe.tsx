'use client';

import { motion } from 'framer-motion';

const areas = [
  { name: 'Shankarpura', icon: '🏘️', tag: 'Our HQ', highlight: true },
  { name: 'Udupi', icon: '🕌', tag: 'City Centre' },
  { name: 'Manipal', icon: '🏛️', tag: 'University Town' },
  { name: 'Brahmavara', icon: '🌳', tag: 'Nearby Town' },
  { name: 'Kaup', icon: '🏖️', tag: 'Coastal Area' },
  { name: 'Kundapura', icon: '⚓', tag: 'Port Town' },
  { name: 'Karkala', icon: '🗿', tag: 'Heritage Town' },
  { name: 'Hebri', icon: '🌿', tag: 'Hill Region' },
];

export function AreasWeServe() {
  return (
    <section className="section-pad" style={{ background: 'linear-gradient(160deg, #0D47A1 0%, #1565C0 60%, #1976D2 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-5"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
          >
            📍 Service Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Areas We Serve
          </h2>
          <p className="text-blue-200 text-base max-w-md mx-auto">
            We cover Shankarpura and surrounding areas across Udupi district, Karnataka
          </p>
        </motion.div>

        {/* Area cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {areas.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-2xl p-4 text-center transition-all cursor-default"
              style={
                area.highlight
                  ? { background: 'linear-gradient(135deg, #F57C00, #FF9800)', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(245,124,0,0.3)' }
                  : { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }
              }
            >
              {area.highlight && (
                <span className="absolute -top-2.5 -right-2.5 px-2 py-0.5 bg-white text-[#F57C00] text-xs font-black rounded-full shadow">
                  ✦ HQ
                </span>
              )}
              <div className="text-3xl mb-2">{area.icon}</div>
              <p className="text-white font-black text-base leading-tight">{area.name}</p>
              <p className={`text-xs font-semibold mt-1 ${area.highlight ? 'text-orange-100' : 'text-blue-200'}`}>
                {area.tag}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Not listed CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="text-blue-200 text-sm mb-4">Not listed? We may still serve your area — just ask!</p>
          <a
            href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20to%20check%20if%20you%20serve%20my%20area."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex text-base"
          >
            <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" /></svg>
            Ask on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
