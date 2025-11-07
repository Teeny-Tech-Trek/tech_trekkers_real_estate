import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}

const FeatureCard = ({ icon, title, description, cardRef }: FeatureCardProps) => {
  return (
    <motion.div 
      ref={cardRef}
      className="group relative h-full"
      style={{
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.03, z: 50 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-700 cursor-pointer h-full"
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

        <div className="relative p-8 flex flex-col h-full">
          {/* 3D Icon Badge */}
          <motion.div
            className="mb-6"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(40px)",
            }}
            whileHover={{ scale: 1.15, rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "3px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255,255,255,0.1)",
              }}
            >
              <div className="text-white">
                {icon}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 flex flex-col" style={{ transform: "translateZ(20px)" }}>
            <h3
              className="text-xl md:text-2xl font-bold text-white leading-tight mb-4"
              style={{
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
              }}
            >
              {title}
            </h3>
            <p className="text-sm md:text-base text-white/85 leading-relaxed flex-1">
              {description}
            </p>
          </div>

          {/* Corner accent with pulse */}
          <div 
            className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-white/40 animate-pulse"
            style={{ animationDuration: '2s' }}
          ></div>
        </div>

        {/* Bottom accent line with glow */}
        <div
          className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 ease-out"
          style={{
            background: "linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
        ></div>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
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

    // Animate cards with 3D perspective and stagger
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            rotateX: 45,
            rotateY: -25,
            z: -200,
            scale: 0.8,
          },
          {
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
            z: 0,
            scale: 1,
            duration: 1.2,
            delay: 0.8 + index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
            },
          }
        );
      }
    });

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
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6"></path><path d="M12 17v6"></path><path d="m4.2 4.2 4.2 4.2"></path><path d="m15.6 15.6 4.2 4.2"></path><path d="M1 12h6"></path><path d="M17 12h6"></path><path d="m4.2 19.8 4.2-4.2"></path><path d="m15.6 8.4 4.2-4.2"></path></svg>,
      title: "Avatar Management",
      description: "Create and customize AI avatars with unique appearances, voices, scripts, and availability. Preview and deploy in minutes."
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M13 8H7"></path><path d="M17 12H7"></path></svg>,
      title: "Lead Capture",
      description: "Web chat widget with voice/video calling via WebRTC. Your avatars engage visitors 24/7 with agent takeover when needed."
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>,
      title: "Property Management",
      description: "Add properties with images, specs, prices, floor plans, and 3D/AR assets. Create stunning property pages with lead attribution."
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>,
      title: "Smart Scheduling",
      description: "Integrated calendar booking with Google/iCal sync. Automated reminders via email, SMS, and WhatsApp keep prospects engaged."
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect></svg>,
      title: "CRM Integration",
      description: "Two-way sync with HubSpot, Salesforce, Zoho, and proptech APIs. OAuth authentication with webhook-based lead attribution."
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M3 3v18h18"></path><path d="M18 17V9l-5-5-5 5v8"></path></svg>,
      title: "Analytics & Commission",
      description: "Real-time dashboards track leads, conversions, and revenue. Automatic 1% commission calculation with detailed payout history."
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden relative w-full py-16 md:py-24"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
      id="features"
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
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl mb-8 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-blue-400/50 animate-pulse"></div>
            <span className="text-sm font-bold text-white tracking-wide">Core Capabilities • 06</span>
          </motion.div>

          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight"
            style={{
              textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              transform: `translateZ(100px)`,
            }}
          >
            Everything You Need to
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mt-2">
              Close More Deals
            </span>
          </h2>

          <p
            ref={descRef}
            className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium"
            style={{
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            A complete platform for real estate agents and builders to deploy virtual sales agents and automate their sales process.
          </p>
        </div>

        {/* Feature Cards Grid - 3D Layout */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
          style={{ perspective: "2000px" }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              cardRef={(el) => (cardsRef.current[index] = el)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;