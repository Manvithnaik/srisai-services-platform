'use client';

import { motion } from 'framer-motion';

const areas = [
  { name: 'Shankarpura', icon: '🏘️', tag: 'Main Base', highlight: true },
  { name: 'Udupi', icon: '🕌', tag: 'City Centre', highlight: false },
  { name: 'Manipal', icon: '🏛️', tag: 'University Town', highlight: false },
  { name: 'Brahmavara', icon: '🌳', tag: 'Nearby Town', highlight: false },
  { name: 'Kaup', icon: '🏖️', tag: 'Coastal Area', highlight: false },
  { name: 'Kundapura', icon: '⚓', tag: 'Port Town', highlight: false },
];

export function AreasWeServe() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-900 to-blue-950 relative overflow-hidden">
      {/* Background decorations */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-4 border border-white/20">
            <span className="text-white/80 font-semibold text-sm">📍 Service Coverage</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Areas We Serve</h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            We cover Shankarpura and surrounding areas of Udupi district, Karnataka
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {areas.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`relative rounded-2xl p-5 border transition-all cursor-default ${
                area.highlight
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400/50 shadow-xl shadow-orange-500/20'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
              }`}
            >
              {area.highlight && (
                <div className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-black px-2 py-0.5 rounded-full shadow">
                  ✦ HQ
                </div>
              )}
              <div className="text-3xl mb-2">{area.icon}</div>
              <h3 className="text-white font-black text-lg leading-tight">{area.name}</h3>
              <p className={`text-xs font-medium mt-1 ${area.highlight ? 'text-orange-100' : 'text-blue-200'}`}>
                {area.tag}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="text-center mt-10"
        >
          <p className="text-blue-300 text-sm mb-4">Not listed? We may still serve your area.</p>
          <a
            href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20to%20check%20if%20you%20serve%20my%20area."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
            </svg>
            Ask on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
