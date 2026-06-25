'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

const WA_ICON = (
  <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z"/>
  </svg>
);

const footerLinks = [
  { title:'Services', links:[
    {label:'Electrical',href:'/file-complaint'},{label:'Plumbing',href:'/file-complaint'},
    {label:'Water Tank Cleaning',href:'/file-complaint'},{label:'Appliance Repair',href:'/file-complaint'},
    {label:'Emergency Repair',href:'/file-complaint'},
  ]},
  { title:'Quick Links', links:[
    {label:'Book a Service',href:'/file-complaint'},{label:'Track My Request',href:'/track-complaint'},
    {label:'Gallery',href:'/gallery'},{label:'Give Feedback',href:'/feedback'},
    {label:'All Services',href:'/services'},
  ]},
];

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden"
      style={{ background:'linear-gradient(180deg,#0B1422 0%,#05101A 100%)' }}>
      <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background:'radial-gradient(circle,#C84B11,transparent)', transform:'translate(30%,0)' }} />
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background:'radial-gradient(circle,#C88A10,transparent)', transform:'translate(-30%,0)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8 relative">

        {/* Emergency banner */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="rounded-3xl p-7 md:p-10 mb-14 text-center relative overflow-hidden"
          style={{ background:'linear-gradient(135deg,#A03A0A,#C84B11)', border:'1px solid rgba(255,255,255,0.12)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background:'radial-gradient(circle,white,transparent)', transform:'translate(30%,-30%)' }} />
          <div className="relative z-10">
            <p className="text-3xl md:text-4xl font-black text-white mb-3">⚡ Emergency? We're Here 24/7</p>
            <p className="text-orange-100 text-base md:text-lg mb-7 max-w-lg mx-auto">
              Urgent repair needed? Call or WhatsApp immediately. We respond within <strong className="text-white">15 minutes</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
              <a href="https://wa.me/918431759374?text=EMERGENCY%20-%20I%20need%20urgent%20repair%20help."
                target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 justify-center text-base">
                {WA_ICON} Emergency WhatsApp
              </a>
              <a href="tel:+918431759374"
                className="flex items-center justify-center gap-2 flex-1 min-h-[56px] rounded-full bg-white font-bold text-base hover:bg-orange-50 transition-colors"
                style={{ color:'#C84B11' }}>
                📞 Call Now
              </a>
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <h3 className="text-2xl font-black text-white mb-2">
              <span style={{ color:'#E8A040' }}>Shree Devi</span>{' '}
              <span style={{ color:'#C84B11' }}>Services</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Trusted home maintenance experts in Udupi district. Fast, reliable, professional. Serving families since 2020.
            </p>
            <div className="space-y-3">
              {[
                { href:'tel:+918431759374', icon:Phone, text:'+91 84317 59374' },
                { href:'mailto:Srideviservice.1122@gmail.com', icon:Mail, text:'Srideviservice.1122@gmail.com' },
              ].map(item => (
                <a key={item.text} href={item.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background:'rgba(255,255,255,0.08)' }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(200,75,17,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,0.08)')}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </a>
              ))}
              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(255,255,255,0.08)' }}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Shankarpura, Udupi, Karnataka</span>
              </div>
            </div>
          </motion.div>

          {footerLinks.map((col, i) => (
            <motion.div key={col.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ delay:(i+1)*0.1 }}>
              <h4 className="font-black text-base text-white mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors group">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors group-hover:bg-[#C84B11]"
                        style={{ background:'#1A3A5C' }} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ delay:0.3 }}>
            <h4 className="font-black text-base text-white mb-5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C88A10]" /> Working Hours
            </h4>
            <ul className="space-y-3 text-sm">
              {[{day:'Monday – Friday',hours:'8:00 AM – 8:00 PM'},{day:'Saturday – Sunday',hours:'9:00 AM – 6:00 PM'}].map(item => (
                <li key={item.day} className="pb-3 border-b last:border-0" style={{ borderColor:'rgba(255,255,255,0.08)' }}>
                  <p className="text-gray-300 font-semibold">{item.day}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{item.hours}</p>
                </li>
              ))}
              <li>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background:'linear-gradient(135deg,#25D366,#128C7E)' }}>
                  🌙 24/7 Emergency Support
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-gray-500 text-sm"
          style={{ borderColor:'rgba(255,255,255,0.08)' }}>
          <p>© {new Date().getFullYear()} Shree Devi Services. All rights reserved.</p>
          <p>Made with ❤️ in Udupi, Karnataka 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
