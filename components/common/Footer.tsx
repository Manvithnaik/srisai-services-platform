import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xl font-black text-blue-400">Shree Devi</span>
              <span className="text-xl font-black text-orange-400">Services</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trusted home maintenance experts in Shankarpura, Udupi. Electrical, plumbing, and appliance repairs with same-day service.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition">Gallery</Link></li>
              <li><Link href="/file-complaint" className="hover:text-white transition">Book Service</Link></li>
              <li><Link href="/feedback" className="hover:text-white transition">Feedback</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-white">Our Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>⚡ Electrical Repairs</li>
              <li>🔧 Plumbing Services</li>
              <li>❄️ AC Servicing</li>
              <li>🔌 Appliance Repair</li>
              <li>🚿 Bathroom Fitting</li>
              <li>💡 Wiring & Fitting</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="tel:+917337843016" className="hover:text-white transition flex items-center gap-2">
                  📞 +91 73378 43016
                </a>
              </li>
              <li>
                <a href="mailto:manvithnaik612@gmail.com" className="hover:text-white transition flex items-center gap-2">
                  ✉️ manvithnaik612@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Shankarpura, Udupi, Karnataka</span>
              </li>
              <li className="text-green-400 font-medium">
                🕐 Available 24/7 for emergencies
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Shree Devi Services. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Fast · Reliable · Trusted in Udupi, Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
