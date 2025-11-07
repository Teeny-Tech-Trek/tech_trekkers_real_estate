import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ImageShowcaseSection = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const featuresRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

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

    // Animate description
    gsap.fromTo(
      descRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate image with 3D rotation
    gsap.fromTo(
      imageRef.current,
      { 
        opacity: 0, 
        x: -100,
        rotateY: -25,
        z: -200,
        scale: 0.9
      },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        z: 0,
        scale: 1,
        duration: 1.2,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );

    // Animate feature pills with stagger
    gsap.fromTo(
      featuresRef.current,
      { 
        opacity: 0, 
        scale: 0.8,
        y: 20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
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

  const features = [
    "24/7 Lead Engagement",
    "Smart Qualification",
    "Auto Scheduling",
    "CRM Integration"
  ];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden relative w-full py-16 md:py-24"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
      id="showcase"
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
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center" style={{ perspective: "2000px" }}>
          {/* LEFT SIDE - Image (50%) */}
          <motion.div
            ref={imageRef}
            className="w-full lg:w-1/2"
            style={{
              transformStyle: "preserve-3d",
            }}
            whileHover={{ scale: 1.02, z: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-2 group cursor-pointer"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              }}
            >
              {/* Animated gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                }}
              ></div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10">
                <div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1500"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                ></div>
              </div>

              <img 
                src="/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png" 
                alt="Virtual real estate sales agent avatar interface" 
                className="w-full h-auto object-cover"
              />

              {/* Live Indicator Badge */}
              <motion.div 
                className="absolute top-6 right-6 px-5 py-3 rounded-full shadow-2xl z-20"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse"></div>
                  <span className="text-sm font-black text-blue-900">Live Demo</span>
                </div>
              </motion.div>

              {/* Bottom accent line with glow */}
              <div
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 ease-out z-10"
                style={{
                  background: "linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))",
                  boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                }}
              ></div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - Content (50%) */}
          <div className="w-full lg:w-1/2 space-y-8" style={{ perspective: "1500px" }}>
            {/* Badge */}
            <motion.div
              ref={badgeRef}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-blue-400/50 animate-pulse"></div>
              <span className="text-sm font-bold text-white tracking-wide">Live Demo • 05</span>
            </motion.div>

            {/* Headline */}
            <h2
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight"
              style={{
                textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                transform: `translateZ(100px)`,
              }}
            >
              See Your Virtual Agent
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mt-2">
                in Action
              </span>
            </h2>
            
            {/* Description */}
            <p
              ref={descRef}
              className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-medium max-w-2xl"
              style={{
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              Watch how our AI-powered avatars engage with prospects, qualify leads, 
              and schedule visits while you focus on closing deals.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  ref={(el) => (featuresRef.current[index] = el)}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full backdrop-blur-sm shadow-lg cursor-pointer group"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "2px solid rgba(255, 255, 255, 0.15)",
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    background: "rgba(255, 255, 255, 0.12)",
                    borderColor: "rgba(255, 255, 255, 0.25)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle2 
                    className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" 
                    strokeWidth={2.5}
                  />
                  <span className="text-sm font-bold text-white">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats section - Enhanced 3D Cards */}
            <div className="pt-6 mt-6">
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                {[
                  { value: "24/7", label: "Available" },
                  { value: "100%", label: "Automated" },
                  { value: "2K+", label: "Active Users" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-6 rounded-2xl backdrop-blur-sm group cursor-pointer"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                      transformStyle: "preserve-3d",
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      background: "rgba(255, 255, 255, 0.08)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div 
                      className="text-3xl lg:text-4xl font-black text-white mb-2"
                      style={{
                        textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm lg:text-base text-white/85 font-bold">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;