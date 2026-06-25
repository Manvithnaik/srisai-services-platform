'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer id="contact" className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-black mb-4 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Shree Devi</span>
              <span className="text-orange-400">Services</span>
            </h3>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed font-medium">
              Trusted home maintenance experts. Quick, reliable, professional. Serving Udupi district with excellence.
            </p>
            <div className="flex gap-3">
              {['f', 'i', 'l'].map((social, idx) => (
                <motion.a
                  key={idx}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.4 }}
                  href="#"
                  className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all text-white font-bold text-lg shadow-lg border border-blue-400/30"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="font-black text-lg mb-6 bg-gradient-to-r from-blue-300 to-orange-300 bg-clip-text text-transparent">Services</h4>
            <ul className="space-y-3">
              {['Electrical', 'Plumbing', 'Water Tank Cleaning', 'Appliance Repair'].map((service) => (
                <li key={service}>
                  <motion.a
                    whileHover={{ x: 6, color: '#60a5fa' }}
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-all font-medium text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" />
                    {service}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-black text-lg mb-6 bg-gradient-to-r from-blue-300 to-orange-300 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Gallery', 'Testimonials', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <motion.a
                    whileHover={{ x: 6, color: '#60a5fa' }}
                    href="#"
                    className="text-gray-300 hover:text-blue-400 transition-all font-medium text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full" />
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-black text-lg mb-6 bg-gradient-to-r from-blue-300 to-orange-300 bg-clip-text text-transparent">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <motion.div whileHover={{ scale: 1.2 }} className="text-blue-400 mt-0.5 flex-shrink-0 bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-800/50 transition-all">
                  <Phone size={18} />
                </motion.div>
                <div>
                  <p className="text-white font-bold">+91 84317 59374</p>
                  <p className="text-xs text-gray-400">Available 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <motion.div whileHover={{ scale: 1.2 }} className="text-blue-400 mt-0.5 flex-shrink-0 bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-800/50 transition-all">
                  <Mail size={18} />
                </motion.div>
                <a href="mailto:Srideviservice.1122@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors text-sm font-medium">
                  Srideviservice.1122@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <motion.div whileHover={{ scale: 1.2 }} className="text-blue-400 mt-0.5 flex-shrink-0 bg-blue-900/30 p-2 rounded-lg group-hover:bg-blue-800/50 transition-all">
                  <MapPin size={18} />
                </motion.div>
                <div>
                  <p className="text-gray-300 font-medium text-sm">Shankarpura, Udupi, Karnataka</p>
                  <p className="text-xs text-gray-400">Service across city</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Emergency Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-orange-600 p-10 md:p-16 mb-12 text-center border border-red-400/30"
        >
          {/* Animated background */}
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full pointer-events-none"
          />
          
          <div className="relative z-10">
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black mb-4 text-white drop-shadow-lg"
            >
              ⚡ Emergency Support Available
            </motion.h3>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-red-100 mb-8 text-xl font-semibold max-w-2xl mx-auto"
            >
              Need urgent help? Contact us anytime. We respond within <span className="font-black text-white">15 minutes</span>.
            </motion.p>
            <motion.a
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1, boxShadow: '0 25px 50px rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/918431759374?text=EMERGENCY%20-%20I%20need%20urgent%20help"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-red-700 font-black text-lg rounded-full hover:shadow-2xl transition-all border-2 border-white/50"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.23.381-.846.954-1.035 1.154-.193.199-.378.222-.675.041-.297-.182-1.022-.378-1.852-.571-.685-.187-1.292-.46-1.801-.999-.509-.54-.809-1.234-.936-2.031-.099-.707-.001-1.259.194-1.497.196-.237.461-.592.692-.888.23-.297.323-.507.323-.846 0-.338-.108-.646-.273-.883-.165-.237-.982-.451-1.334-.451-.352 0-1.139.223-1.734.671-.595.449-.74 1.236-.888 1.884-.148.648.15 1.295.784 2.107.633.812 2.213 2.334 4.776 3.359 2.563 1.025 3.566 1.07 4.101 1.07.535 0 .848-.223 1.195-.671.347-.449.462-.898.616-1.195.154-.297.308-.447.606-.447.298 0 1.895.223 2.21.671.316.449.316 1.236.079 1.934-.237.697-.883 1.295-1.779 1.534z" />
              </svg>
              Emergency WhatsApp Call
            </motion.a>
          </div>
        </motion.div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock size={24} className="text-blue-400" />
            <h4 className="font-bold text-lg">Working Hours</h4>
          </div>
          <div className="space-y-3 text-gray-300">
            <div>
              <p className="font-semibold text-white">Office Hours (Mon – Sun)</p>
              <p>9:00 AM – 5:00 PM</p>
            </div>
            <div>
              <p className="font-semibold text-white">Website Bookings Response</p>
              <p>8:00 AM – 10:00 PM</p>
            </div>
          </div>
          <p className="text-blue-400 font-semibold mt-4">📞 24/7 Phone & Emergency Support Available</p>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 text-center text-gray-400"
        >
          <p>
            &copy; {new Date().getFullYear()} Shree Devi Services. All rights reserved. Made with ❤️ in Udupi, Karnataka.
          </p>
          <p className="mt-2 text-sm">
            Follow us on social media for updates and special offers.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
