import Link from 'next/link';

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-6">
            ✦ Udupi's Trusted Maintenance Experts
          </span>
          <h1 className="text-5xl font-black mb-4 leading-tight">
            Fast Electrical &<br />
            <span className="text-orange-300">Plumbing Support</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Shree Devi Services — professional home and business maintenance in Shankarpura, Udupi. Same-day service, verified technicians, 24/7 emergency support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/file-complaint"
              className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition text-center"
            >
              Book Service Now
            </Link>
            <a
              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
