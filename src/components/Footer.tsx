import React, { useEffect, useRef, useState } from "react";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoImg from "../imges/WhatsApp_Image_2025-11-05_at_5.37.53_PM-removebg-preview.png";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const contentRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Animate footer content
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Floating particles component
  const FloatingParticle = ({ delay, duration, initialX, initialY, size = 2 }) => (
    <motion.div
      className="absolute rounded-full bg-white/20"
      style={{ width: size, height: size }}
      initial={{ x: initialX, y: initialY, opacity: 0 }}
      animate={{
        x: [initialX, initialX + 50, initialX],
        y: [initialY, initialY - 100, initialY],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  const footerLinks = {
    company: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Press Kit", href: "#press" }
    ],
    legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "GDPR", href: "#gdpr" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" }
  ];

  return (
    <footer 
      ref={footerRef}
      className="w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
    >
      {/* Animated gradient background - Same as HumanoidSection */}
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

      {/* Grid overlay - Same as HumanoidSection */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating particles - Same as HumanoidSection */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.4}
              duration={6 + i * 0.3}
              initialX={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)}
              initialY={Math.random() * 300}
              size={Math.random() * 3 + 1}
            />
          ))}
        </div>
      )}

      {/* Top Border Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        }}
      />

      <div ref={contentRef} className="container px-6 lg:px-12 mx-auto py-12 md:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <img src={LogoImg} alt="logo" className="w-8 h-8" />
              </div>
              <span className="text-xl font-black text-white">
                TrekEstateAgent
              </span>
            </motion.div>
            <p className="text-white/85 text-sm md:text-base mb-6 max-w-xs font-medium">
              AI-powered virtual agents for real estate sales.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center text-white shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      background: "rgba(255, 255, 255, 0.95)",
                      rotate: 360
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-black mb-4 text-sm md:text-base">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Dashboard", href: "/dashboard" }
              ].map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href={link.href} 
                    className="text-white/85 hover:text-white transition-colors text-sm md:text-base font-semibold inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-black mb-4 text-sm md:text-base">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href={link.href} 
                    className="text-white/85 hover:text-white transition-colors text-sm md:text-base font-semibold inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-black mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <motion.a 
                    href={link.href} 
                    className="text-white/85 hover:text-white transition-colors text-sm md:text-base font-semibold inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div 
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <p className="text-white/85 text-sm md:text-base font-semibold">
            © {currentYear} Pulse Robot. All rights reserved.
          </p>
          
          <motion.div 
            className="flex items-center gap-2 text-white/85 text-sm md:text-base font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse"></div>
            <span>Trusted by 2,000+ agents</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;