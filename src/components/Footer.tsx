import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Dasboard", href: "/login" },
    
  ];

  return (
    <footer 
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Top Border Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        }}
      />

      <div className="container px-6 lg:px-12 mx-auto py-8 md:py-12 relative z-10">
        {/* Navigation Links - Centered */}
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {navigationLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              className="text-white/90 hover:text-white text-base md:text-lg font-semibold transition-colors relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {link.label}
              {/* Underline animation */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/90 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <div 
          className="h-px w-full mb-6"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
          }}
        />

        {/* Copyright - Centered */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-white/80 text-sm md:text-base font-medium">
            © {currentYear} TrekEstateAgent. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;