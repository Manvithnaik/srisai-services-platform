'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const team = [
  {
    name: 'Mr. Saieesh Kumar',
    role: 'Co-Founder & Chief Electrical Technician',
    photo: '/founder-saieesh.jpg',
    expertise: ['Electrical Wiring', 'Power Systems', 'Fan & Lighting', 'Plumbing'],
    experience: '5+ Years',
    badge: '⚡',
    badgeLabel: 'Electrical Expert',
    color: '#C84B11',
    gradient: 'linear-gradient(135deg, #C84B11, #E05A1A)',
    bio: 'Saieesh brings deep expertise in electrical systems — from household wiring and fault-finding to complete panel setups. Known for his precision and speed, he has personally handled over 2,000 electrical jobs across Udupi district.',
  },
  {
    name: 'Mr. Sampath Kumar',
    role: 'Co-Founder & Chief Service Technician',
    photo: '/founder-sampath.jpg',
    expertise: ['Electrical Wiring', 'Power Systems', 'Fan & Lighting', 'Plumbing', 'Appliance Repair', 'Home Maintenance'],
    experience: '6+ Years',
    badge: '🔧',
    badgeLabel: 'Service Expert',
    color: '#1A3A5C',
    gradient: 'linear-gradient(135deg, #1A3A5C, #2A5080)',
    bio: 'Sampath leads our service operations with exceptional technical knowledge in plumbing, electrical wiring, appliance repair, and general home maintenance. His dedication to customer satisfaction has earned us thousands of 5-star reviews.',
  },
  {
    name: 'Mr. Vikas',
    role: 'Co-Founder & Senior Technician',
    photo: '/founder-vikas.jpg',
    expertise: ['Electrical Wiring', 'Power Systems', 'Fan & Lighting', 'Plumbing'],
    experience: '6+ Years',
    badge: '🛠️',
    badgeLabel: 'Multi-Skill Expert',
    color: '#2D5A27',
    gradient: 'linear-gradient(135deg, #2D5A27, #4A9A40)',
    bio: 'Vikas is a seasoned multi-skilled technician with 6 years of hands-on experience in both electrical installations and plumbing solutions. His versatility makes him the go-to expert for complex, multi-trade home repair jobs.',
  },
];

export function MeetTheTeam() {
  return (
    <section className="section-pad bg-card relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #C84B11, transparent)' }} />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #1A3A5C, transparent)' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4 inline-flex">👥 Meet the Team</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
            The People Behind{' '}
            <span className="gradient-text-terra">Your Home's Safety</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Our founders are not just managers — they are hands-on technicians who personally
            handle the toughest jobs to ensure the highest quality.
          </p>
        </motion.div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden bg-background border-2 group interactive-glow-card"
              style={{
                borderColor: `${member.color}20`,
                boxShadow: `0 4px 32px ${member.color}10`,
                '--glow-card-color': member.color,
                '--glow-card-shadow': `${member.color}40`,
                '--glow-card-shadow-subtle': `${member.color}20`,
              } as React.CSSProperties}
            >
              {/* Top colour bar */}
              <div className="h-1.5 w-full" style={{ background: member.gradient }} />

              <div className="p-6 md:p-7">
                {/* Photo + Name Row */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Photo */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4"
                      style={{ borderColor: `${member.color}30` }}
                    >
                      <Image
                        src={member.photo}
                        alt={`Photo of ${member.name}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover object-top"
                        quality={90}
                      />
                    </div>
                    {/* Badge */}
                    <div
                      className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-md border-2 border-card"
                      style={{ background: member.gradient }}
                    >
                      {member.badge}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-lg font-black text-foreground leading-tight mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold mb-3" style={{ color: member.color }}>
                      {member.role}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {/* Experience chip */}
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{ background: member.gradient }}
                      >
                        🏅 {member.experience}
                      </span>
                      {/* Speciality chip */}
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ background: `${member.color}12`, color: member.color, border: `1px solid ${member.color}25` }}
                      >
                        {member.badgeLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {member.bio}
                </p>

                {/* Expertise tags */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2.5">
                    Areas of Expertise
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold border"
                        style={{
                          background: `${member.color}08`,
                          color: member.color,
                          borderColor: `${member.color}20`,
                        }}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-semibold border-2"
            style={{ background: 'linear-gradient(135deg, rgba(26,58,92,0.06), rgba(200,75,17,0.06))', borderColor: 'rgba(200,75,17,0.15)' }}
          >
            <span className="text-2xl">🤝</span>
            <span className="text-foreground">
              All three founders personally inspect every completed job — your satisfaction is their promise.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
