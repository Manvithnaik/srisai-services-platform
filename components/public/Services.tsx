const services = [
  {
    id: 1,
    title: 'Electrical Repairs',
    description: 'Faulty switches, tripped circuits, power failures — our certified electricians fix it fast.',
    icon: '⚡',
  },
  {
    id: 2,
    title: 'Plumbing Services',
    description: 'Leaking pipes, blocked drains, tap fittings, and more. Same-day plumber available.',
    icon: '🔧',
  },
  {
    id: 3,
    title: 'Bathroom Fitting',
    description: 'Complete bathroom renovation — tiles, fixtures, plumbing, sanitary fittings.',
    icon: '🚿',
  },
  {
    id: 4,
    title: 'AC Servicing',
    description: 'AC installation, service, gas refilling, and repair for all brands.',
    icon: '❄️',
  },
  {
    id: 5,
    title: 'Appliance Repair',
    description: 'Washing machine, refrigerator, geyser, and home appliance repairs.',
    icon: '🔌',
  },
  {
    id: 6,
    title: 'Wiring & Fitting',
    description: 'New wiring, switch board fitting, CCTV, fan installation and more.',
    icon: '💡',
  },
];

export function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            What We Do
          </span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Expert electrical, plumbing, and maintenance services for homes and businesses across Udupi district.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/file-complaint"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg"
          >
            Book Any Service
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
