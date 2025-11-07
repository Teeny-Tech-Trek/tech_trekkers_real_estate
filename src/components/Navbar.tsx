import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoImg from "../imges/WhatsApp_Image_2025-11-05_at_5.37.53_PM-removebg-preview.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Header style on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth-scroll on initial load if URL has a hash
  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const handleNavClick = (e, href) => {
    const currentPath = window.location.pathname;

    // Home
    if (href === "/") {
      e.preventDefault();
      if (currentPath === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
      return;
    }

    // In-page hash links
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);

      if (currentPath === "/") {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = `/${href}`;
      }
      return;
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-2xl shadow-2xl" 
          : ""
      }`}
      style={{
        background: isScrolled 
          ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(30, 58, 138, 0.95) 100%)'
          : 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
    >
      {/* Top Border Line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
        }}
      />

      <div className="container px-6 lg:px-12 mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a 
            href="/" 
            className="flex items-center gap-3 group" 
            onClick={(e) => handleNavClick(e, "/")}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="w-12 h-12 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-xl"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <img src={LogoImg} alt="logo" className="w-10 h-10" />
            </div>
            <span className="text-xl md:text-2xl font-black text-white">TrekEstateAgent</span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-base font-bold text-white/90 hover:text-white transition-colors duration-300 relative group"
                onClick={(e) => handleNavClick(e, link.href)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {link.label}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/dashboard">
              <motion.button 
                className="px-6 py-2.5 text-base font-black text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: "rgba(255, 255, 255, 0.15)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>
            </a>
            <a href="/dashboard">
              <motion.button 
                className="px-6 py-2.5 text-base font-black rounded-xl shadow-2xl text-blue-900"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: "rgba(255, 255, 255, 1)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden p-2.5 text-white rounded-xl transition-colors duration-300 backdrop-blur-sm"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 space-y-3">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="block text-base font-bold text-white/90 hover:text-white transition-all duration-300 py-3 px-5 rounded-xl backdrop-blur-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                    onClick={(e) => {
                      handleNavClick(e, link.href);
                      setIsOpen(false);
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      x: 5,
                      background: "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Mobile Auth */}
                <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                  <a href="/dashboard">
                    <motion.button 
                      className="w-full px-6 py-3 text-base font-black text-white rounded-xl transition-all duration-300 backdrop-blur-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "2px solid rgba(255, 255, 255, 0.2)",
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        background: "rgba(255, 255, 255, 0.15)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Login
                    </motion.button>
                  </a>
                  <a href="/dashboard">
                    <motion.button 
                      className="w-full px-6 py-3 text-base font-black rounded-xl shadow-2xl text-blue-900"
                      style={{
                        background: "rgba(255, 255, 255, 0.95)",
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        background: "rgba(255, 255, 255, 1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Up
                    </motion.button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;