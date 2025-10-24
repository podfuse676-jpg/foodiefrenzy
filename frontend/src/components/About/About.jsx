import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaXTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa6';
import { features, stats, teamMembers } from '../../assets/dummydata';

const About = () => {
  const [hoveredStat, setHoveredStat] = useState(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#333333] via-[#444444] to-[#4CAF50] text-[#FAFAFA] overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 mix-blend-soft-light"></div>
      <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="py-16 px-4 text-center relative">
        <div className="max-w-4xl mx-auto">
          <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 font-serif bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#F4D03F]">
            Grocery Excellence
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-[#FAFAFA]/80">
            Your trusted partner for fresh groceries and quality products delivered to your doorstep
          </motion.p>
        </div>
      </motion.section>

      <section className="py-12 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -100px 0px" }} transition={{ delay: i * 0.2 }} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#4CAF50]/30 to-[#388E3C]/30 rounded-3xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative bg-[#444444]/90 backdrop-blur-lg rounded-3xl overflow-hidden border border-[#4CAF50]/30 hover:border-[#4CAF50] transition-all duration-300 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <motion.img src={f.img} alt={f.title} className="w-full h-full object-cover" initial={{ scale: 1 }} whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#333333] via-transparent to-transparent" />
                  </div>
                  <div className="p-8">
                    <motion.div className="text-[#4CAF50] mb-4 inline-block" whileHover={{ rotate: 15 }}>
                      <Icon className="w-12 h-12 text-[#4CAF50]" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-[#FAFAFA]">{f.title}</h3>
                    <p className="text-[#FAFAFA]/80">{f.text}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-[#333333] to-[#444444]/90">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2, type: 'spring' }} className="relative group h-48"
                onHoverStart={() => setHoveredStat(i)} onHoverEnd={() => setHoveredStat(null)} animate={{ scale: hoveredStat === i ? 1.05 : 1, zIndex: hoveredStat === i ? 10 : 1 }}>
                <motion.div className="absolute inset-0" animate={{ y: [0, -15, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 } }}>
                  <div className="relative h-full bg-[#444444]/40 backdrop-blur-lg rounded-xl border-2 border-[#4CAF50]/30 p-6 overflow-hidden transition-all duration-300">
                    <motion.div className="absolute inset-0 rounded-xl" animate={{ background: [
                      'linear-gradient(45deg, #444444 0%, #333333 50%, #444444 100%)',
                      'linear-gradient(45deg, #444444 0%, #333333 80%, #444444 100%)',
                      'linear-gradient(45deg, #444444 0%, #333333 50%, #444444 100%)'
                    ]}} transition={{ duration: 6, repeat: Infinity }} />
                    <div className="absolute inset-0 rounded-xl shadow-lg shadow-[#333333]/20" />
                    <div className="relative z-10 h-full flex flex-col items-center justify-center">
                      <motion.div className="mb-4 p-3 rounded-full bg-[#333333]/30 border border-[#4CAF50]/30" whileHover={{ scale: 1.1, rotate: 10 }}>
                        <Icon className="w-8 h-8 text-[#4CAF50]/90" />
                      </motion.div>
                      <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-[#FAFAFA] to-[#F4D03F] bg-clip-text text-transparent">{s.number}</div>
                      <motion.div className="text-sm uppercase tracking-widest font-medium text-[#FAFAFA]/80" animate={{ letterSpacing: hoveredStat === i ? '0.15em' : '0.1em', textShadow: hoveredStat === i ? '0 0 8px rgba(76, 175, 80, 0.4)' : 'none' }}>{s.label}</motion.div>
                    </div>
                    <motion.div className="absolute inset-0 bg-[#333333]/10 rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: hoveredStat === i ? 1 : 0 }} />
                  </div>
                </motion.div>
                <motion.div className="absolute inset-x-4 bottom-0 h-8 bg-[#333333]/30 blur-xl rounded-full" animate={{ opacity: hoveredStat === i ? 0.4 : 0.2, scale: hoveredStat === i ? 0.9 : 0.8 }} />
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-4xl font-serif sm:text-5xl md:text-6xl font-bold text-center mb-12 text-[#FAFAFA]">
            Meet Our <span className="text-[#4CAF50]">Team</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            {teamMembers.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -100px 0px" }} transition={{ delay: m.delay }} className="relative group">
                <div className="relative h-full bg-[#444444]/90 backdrop-blur-lg rounded-3xl overflow-hidden border-2 border-[#4CAF50]/30 hover:border-[#4CAF50] transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#4CAF50]/20">
                  <div className="relative h-64 sm:h-72 md:h-96 overflow-hidden">
                    <motion.img src={m.img} alt={m.name} className="w-full h-full object-cover" initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                  </div>
                  <div className="p-8 text-center flex flex-col h-[calc(100%-24rem)]">
                    <div className="mb-4">
                      <h3 className="text-3xl font-bold mb-2 text-[#FAFAFA]">{m.name}</h3>
                      <p className="text-[#4CAF50] text-lg font-medium font-cursive">{m.role}</p>
                    </div>
                    <p className="text-[#FAFAFA]/80 text-lg font-cursive flex-grow">{m.bio}</p>
                    <motion.div className="flex justify-center gap-4 pt-6" initial={{ scale: 0 }} whileInView={{ scale: 1 }}>
                      {Object.entries(m.social).map(([p, url]) => (
                        <a key={p} href={url} target="_blank" rel="noopener noreferrer" className="text-[#4CAF50] hover:text-[#F4D03F] transition-colors duration-300 hover:scale-110">
                          {({ twitter: <FaXTwitter className="w-6 h-6" />, instagram: <FaInstagram className="w-6 h-6" />, facebook: <FaFacebookF className="w-6 h-6" />, linkedin: <FaLinkedinIn className="w-6 h-6" /> })[p]}
                        </a>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
