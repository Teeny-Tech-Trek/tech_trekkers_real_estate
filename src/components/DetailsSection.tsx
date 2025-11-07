import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const DetailsSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const featuresRef = useRef([]);
  const inputsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: ""
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Animate badge with 3D flip
    gsap.fromTo(
      badgeRef.current,
      { opacity: 0, scale: 0.5, rotationY: -180 },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate title with 3D depth
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 100, z: -100, rotationX: 45 },
      {
        opacity: 1,
        y: 0,
        z: 0,
        rotationX: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate left card with 3D perspective
    gsap.fromTo(
      leftCardRef.current,
      { opacity: 0, x: -80, rotateY: -25, z: -200 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        z: 0,
        duration: 1.2,
        delay: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      }
    );

    // Animate right card with 3D perspective
    gsap.fromTo(
      rightCardRef.current,
      { opacity: 0, x: 80, rotateY: 25, z: -200 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        z: 0,
        duration: 1.2,
        delay: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      }
    );

    // Animate features with stagger
    gsap.fromTo(
      featuresRef.current,
      { opacity: 0, x: -30, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: leftCardRef.current,
          start: "top 60%",
        },
      }
    );

    // Animate inputs with stagger
    gsap.fromTo(
      inputsRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rightCardRef.current,
          start: "top 60%",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    alert("Request submitted successfully!");

    setFormData({
      fullName: "",
      email: "",
      company: ""
    });
  };

  const features = [
    { 
      icon: "🎭",
      label: "Avatar Creation", 
      value: "Unlimited",
      description: "Create as many AI agents as you need"
    },
    { 
      icon: "🎯",
      label: "Lead Capture", 
      value: "24/7",
      description: "Never miss a potential client"
    },
    { 
      icon: "🔗",
      label: "CRM Integration", 
      value: "All Major",
      description: "Seamless connection to your tools"
    },
    { 
      icon: "📊",
      label: "Analytics", 
      value: "Real-time",
      description: "Track performance instantly"
    },
    { 
      icon: "💰",
      label: "Commission", 
      value: "1% Auto-calc",
      description: "Automatic commission tracking"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden relative w-full py-16 md:py-24"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
      id="details"
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
          {[...Array(20)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.4}
              duration={6 + i * 0.3}
              initialX={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)}
              initialY={Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)}
              size={Math.random() * 3 + 1}
            />
          ))}
        </div>
      )}

      <div className="container px-6 lg:px-12 mx-auto relative z-10">
        {/* Header Section with 3D Transform */}
        <div className="text-center mb-20" style={{ perspective: "1500px" }}>
          <motion.div
            ref={badgeRef}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-blue-400/50 animate-pulse"></div>
            <span className="text-sm font-bold text-white tracking-wide">Platform Details • 04</span>
          </motion.div>

          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight"
            style={{
              textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              transform: `translateZ(100px)`,
            }}
          >
            Everything You Need to{" "}
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mt-2">
              Succeed
            </span>
          </h2>
        </div>

        {/* Cards Grid - 3D Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2" style={{ perspective: "2000px" }}>
          {/* Left Card - Features */}
          <motion.div
            ref={leftCardRef}
            className="group relative"
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-700"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Animated gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                }}
              ></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                ></div>
              </div>

              {/* Card Header */}
              <div className="relative p-8 md:p-10 border-b border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                    }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-3xl">⚡</span>
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    Platform Features
                  </h3>
                </div>
                <p className="text-base md:text-lg text-white/90 font-medium">
                  Everything you need to deploy virtual sales agents
                </p>
              </div>

              {/* Card Content */}
              <div className="relative p-8 md:p-10 space-y-4">
                {features.map((item, index) => (
                  <motion.div
                    key={index}
                    ref={(el) => (featuresRef.current[index] = el)}
                    className="group/item relative p-5 md:p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      background: "rgba(255, 255, 255, 0.08)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                        }}
                        whileHover={{ scale: 1.15, rotate: 12 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-2">
                          <h4 className="text-base md:text-lg font-bold text-white">
                            {item.label}
                          </h4>
                          <span className="text-base md:text-lg font-black text-white whitespace-nowrap">
                            {item.value}
                          </span>
                        </div>
                        <p className="text-sm md:text-base text-white/85 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="absolute bottom-0 left-0 h-1 w-0 group-hover/item:w-full transition-all duration-500 ease-out"
                      style={{
                        background: "linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))",
                        boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                      }}
                    ></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Card - Form */}
          <motion.div
            ref={rightCardRef}
            className="group relative"
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-700"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Animated gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                }}
              ></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                ></div>
              </div>

              {/* Card Header */}
              <div className="relative p-8 md:p-10 border-b border-white/10">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-sm mb-4"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-lg shadow-white/50"></div>
                  <span className="text-sm font-bold text-white">Start selling smarter</span>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                  Get Started Today
                </h3>
                <p className="text-base md:text-lg text-white/90 font-medium">
                  Join 2,000+ agents already using our platform
                </p>
              </div>

              {/* Card Content - Form */}
              <div className="relative p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div ref={(el) => (inputsRef.current[0] = el)}>
                    <label className="block text-sm font-bold text-white mb-2.5">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      className="w-full px-5 py-4 rounded-xl border-2 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white text-base font-semibold transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      required
                    />
                  </div>

                  <div ref={(el) => (inputsRef.current[1] = el)}>
                    <label className="block text-sm font-bold text-white mb-2.5">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="john@example.com" 
                      className="w-full px-5 py-4 rounded-xl border-2 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white text-base font-semibold transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      required
                    />
                  </div>

                  <div ref={(el) => (inputsRef.current[2] = el)}>
                    <label className="block text-sm font-bold text-white mb-2.5">
                      Real Estate Agency
                    </label>
                    <input 
                      type="text" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleChange} 
                      placeholder="Your Agency Name" 
                      className="w-full px-5 py-4 rounded-xl border-2 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white text-base font-semibold transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      }}
                    />
                  </div>

                  <div ref={(el) => (inputsRef.current[3] = el)}>
                    <motion.button 
                      type="submit"
                      className="w-full px-6 py-4 bg-white text-blue-900 font-black rounded-xl transition-all duration-300 text-base shadow-2xl group/btn"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start Free Trial
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </motion.button>
                  </div>
                </form>

                {/* Trust badges */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-6 text-sm text-white/90 font-semibold">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No credit card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Free 14-day trial</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;