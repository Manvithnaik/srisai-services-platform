export const metadata = {
  title: 'Services | Shree Devi Services',
  description: 'Electrical repairs, plumbing, AC servicing, appliance repair, and more in Udupi, Shankarpura, Karnataka.',
};

const allServices = [
  {
    id: 1,
    title: 'Electrical Repairs',
    icon: '⚡',
    description: 'Fast fixes for faulty switches, short circuits, power failures, and electrical faults.',
    details: 'Switchboard repair, circuit breaker reset, wire replacement, socket fitting, light installation, and emergency power failure repairs.',
    badge: 'Most Requested',
  },
  {
    id: 2,
    title: 'Plumbing Services',
    icon: '🔧',
    description: 'Leaking pipes, tap repairs, drain unblocking, and all plumbing emergencies.',
    details: 'Pipe leak repair, tap/faucet replacement, drain unblocking, toilet repairs, water tank fitting, and pressure issues.',
    badge: null,
  },
  {
    id: 3,
    title: 'Bathroom Fitting',
    icon: '🚿',
    description: 'Complete bathroom renovation and fixture installation.',
    details: 'Shower fitting, commode installation, tile work, geyser fitting, exhaust fan, mirror and vanity installation.',
    badge: null,
  },
  {
    id: 4,
    title: 'AC Servicing & Repair',
    icon: '❄️',
    description: 'AC installation, servicing, gas refilling, and repairs for all brands.',
    details: 'AC installation, deep servicing, gas refilling, cooling issues, remote problems, and panel repairs for all major brands.',
    badge: null,
  },
  {
    id: 5,
    title: 'Appliance Repair',
    icon: '🔌',
    description: 'Washing machine, refrigerator, geyser, and home appliance repairs.',
    details: 'Washing machine (front/top load), refrigerator, water heater/geyser, microwave, and other home appliance repairs.',
    badge: null,
  },
  {
    id: 6,
    title: 'Wiring & Electrical Fitting',
    icon: '💡',
    description: 'New wiring, switchboard fitting, fan installation, and CCTV setup.',
    details: 'Full home wiring, new switchboard installation, ceiling fan fitting, CCTV camera installation, and inverter setup.',
    badge: null,
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold mb-4">
            What We Offer
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Our Services</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Expert electrical, plumbing, and maintenance services across Udupi district. Same-day visits available.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 p-6 border border-gray-100 relative"
            >
              {service.badge && (
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  {service.badge}
                </span>
              )}
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm mb-3 font-medium">{service.description}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{service.details}</p>
              <div className="mt-6">
                <a
                  href="/file-complaint"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition"
                >
                  Book Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency strip */}
        <div className="mt-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-black mb-2">🚨 Emergency Service Available 24/7</h3>
          <p className="text-red-100 mb-6">Power failure, burst pipe, gas leak? Call us immediately.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+917337843016"
              className="px-8 py-3 bg-white text-red-600 font-black rounded-full hover:bg-red-50 transition text-lg"
            >
              📞 +91 73378 43016
            </a>
            <a
              href="https://wa.me/917337843016?text=EMERGENCY%3A%20Hello%20Shree%20Devi%20Services%2C%20I%20need%20urgent%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-full transition"
            >
              WhatsApp Emergency
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
