import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

gsap.registerPlugin(ScrollTrigger);

type FloatingParticleProps = {
  delay: number;
  duration: number;
  initialX: number;
  initialY: number;
  size?: number;
};

const HumanoidSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const subtitleRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use scroll detection to trigger animations
  const { isVisible } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '50px',
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Animate badge - Simplified for performance
    gsap.fromTo(
      badgeRef.current,
      { opacity: 0, scale: 0.8, rotationY: -90 },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "back.out(1.2)",
      }
    );

    // Animate title - Reduced 3D complexity
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.1,
        ease: "power3.out",
      }
    );

    // Animate subtitle
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
      }
    );

    // Animate cards - Simplified 3D
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            rotateX: 25,
            y: 40,
          },
          {
            opacity: 1,
            rotateX: 0,
            y: 0,
            duration: 0.6,
            delay: 0.15 + index * 0.1,
            ease: "power3.out",
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isVisible]);

  // Floating particles component - Memoized for performance
  const FloatingParticle = React.memo(
    ({ delay, duration, initialX, initialY, size = 2 }: FloatingParticleProps) => (
      <motion.div
        className="absolute rounded-full bg-white/20"
        style={{ width: size, height: size, willChange: "transform" }}
        initial={{ x: initialX, y: initialY, opacity: 0 }}
        animate={{
          x: [initialX, initialX + 40, initialX],
          y: [initialY, initialY - 80, initialY],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    )
  );

  const cards = [
    {
      number: "01",
      title: "We're bringing AI sales agents to real estate",
      description: "Transform your real estate business with intelligent AI agents that understand property details and buyer preferences.",
    },
    {
      number: "02",
      title: "We're automating lead capture and qualification 24/7",
      description: "Never miss a potential client. Our AI works round the clock to capture, qualify, and nurture leads automatically.",
    },
    {
      number: "03",
      title: "We're creating sales assistants, not replacements",
      description: "Empower your team with AI that handles routine tasks, letting them focus on building relationships and closing deals.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden relative w-full py-16 md:py-24"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
      id="why-humanoid"
    >
      {/* Animated gradient background - Same as Hero */}
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

      {/* Grid overlay - Same as Hero */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating particles - Reduced count for better performance */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.5}
              duration={5 + i * 0.2}
              initialX={Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)}
              initialY={Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)}
              size={Math.random() * 2.5 + 1}
            />
          ))}
        </div>
      )}

      <div className="container px-6 lg:px-12 mx-auto relative z-10">
        {/* Header Section with 3D Transform */}
        <div className="max-w-4xl mb-20" style={{ perspective: "1500px" }}>
          

          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight"
            style={{
              textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              transform: `translateZ(100px)`,
            }}
          >
            Why Virtual
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mt-2">
              Agents
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl font-medium"
            style={{
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            Revolutionizing real estate sales with intelligent automation that works alongside your team, not against them.
          </p>
        </div>

        {/* Cards Section - 3D Elevated Cards */}
        <div className="space-y-8" style={{ perspective: "2000px" }}>
          {cards.map((card, index) => (
            <motion.div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative"
              style={{
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="relative backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-700 cursor-pointer"
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

                <div className="relative p-8 md:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center gap-8">
                  {/* 3D Number Badge */}
                  <motion.div
                    className="flex-shrink-0"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: "translateZ(40px)",
                    }}
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "3px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(255,255,255,0.1)",
                      }}
                    >
                      <span
                        className="text-4xl font-black text-white"
                        style={{
                          textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        {card.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 space-y-5" style={{ transform: "translateZ(20px)" }}>
                    <h3
                      className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight"
                      style={{
                        textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-3xl">
                      {card.description}
                    </p>
                  </div>

                 
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default HumanoidSection;
