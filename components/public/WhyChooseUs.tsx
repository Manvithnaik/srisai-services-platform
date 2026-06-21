const reasons = [
  {
    id: 1,
    icon: '🏆',
    title: 'Verified Professionals',
    description: 'Background-checked, certified electricians and plumbers with years of hands-on experience.',
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Same-Day Service',
    description: 'We arrive fast. Most service calls are fulfilled the same day, often within hours.',
  },
  {
    id: 3,
    icon: '💰',
    title: 'Transparent Pricing',
    description: 'No hidden fees. Clear quotes before work begins. Pay only for what you approve.',
  },
  {
    id: 4,
    icon: '🕐',
    title: '24/7 Emergency Support',
    description: 'Power outage at midnight? Burst pipe? We\'re available round the clock for emergencies.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
            Why Udupi Trusts Us
          </span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Why Choose Shree Devi Services?</h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            500+ satisfied customers and 1000+ completed service calls across Udupi district speak for themselves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{reason.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-black mb-2">Ready to Book?</h3>
          <p className="text-blue-100 mb-6">Get your issue fixed today by our expert team.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/file-complaint"
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition"
            >
              Book a Service
            </a>
            <a
              href="https://wa.me/917337843016?text=Hello%20Shree%20Devi%20Services%2C%20I%20would%20like%20assistance%20with%20a%20maintenance%20issue."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition flex items-center justify-center gap-2"
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
