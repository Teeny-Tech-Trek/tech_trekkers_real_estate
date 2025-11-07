import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, ArrowRight, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRef = useRef(null);
  const benefitsRef = useRef([]);

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

    // Animate subtitle
    gsap.fromTo(
      subtitleRef.current,
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

    // Animate main card with 3D perspective
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, rotateX: 45, rotateY: -25, z: -200, scale: 0.8 },
      {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        z: 0,
        scale: 1,
        duration: 1.2,
        delay: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      }
    );

    // Animate benefits with stagger
    gsap.fromTo(
      benefitsRef.current,
      { opacity: 0, x: -30, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert("Thank you for subscribing! You'll receive updates about real estate virtual agents soon.");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const benefits = [
    "Weekly industry insights",
    "Early access to new features",
    "Exclusive agent tips"
  ];

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden relative w-full py-16 md:py-24"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
      id="newsletter"
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
        <div className="max-w-4xl mx-auto">
          {/* Header Section with 3D Transform */}
          <div className="text-center mb-16" style={{ perspective: "1500px" }}>
            <motion.div
              ref={badgeRef}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-blue-400/50 animate-pulse"></div>
              <span className="text-sm font-bold text-white tracking-wide">Newsletter • 08</span>
            </motion.div>

            <h2
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight"
              style={{
                textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                transform: `translateZ(100px)`,
              }}
            >
              Stay Ahead of
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mt-2">
                the Curve
              </span>
            </h2>

            <p
              ref={subtitleRef}
              className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-medium"
              style={{
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              Get the latest insights on real estate technology, AI agents, and industry trends
            </p>
          </div>

          {/* Main Newsletter Card - 3D Effect */}
          <motion.div
            ref={cardRef}
            className="group relative"
            style={{
              transformStyle: "preserve-3d",
              perspective: "2000px",
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

              <div className="relative p-8 md:p-12 z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input with Icon */}
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Mail className="w-5 h-5 text-white/60" strokeWidth={2.5} />
                    </div>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="Enter your email address" 
                      className="w-full pl-14 pr-6 py-4 rounded-xl border-2 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 text-base font-semibold"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      required 
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-white text-blue-900 rounded-xl font-black transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin"></div>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe Now
                        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Benefits List */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        ref={(el) => (benefitsRef.current[index] = el)}
                        className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm transition-all duration-300"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                        whileHover={{
                          scale: 1.05,
                          background: "rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                          style={{
                            background: "rgba(255, 255, 255, 0.95)",
                          }}
                        >
                          <Check className="w-3.5 h-3.5 text-blue-900" strokeWidth={3} />
                        </div>
                        <span className="text-sm md:text-base text-white font-semibold">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Privacy Note */}
                <motion.p
                  className="mt-6 text-sm text-center text-white/70 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  By subscribing, you agree to receive emails from us. Unsubscribe anytime.
                </motion.p>
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
        </div>
      </div>
    </section>
  );
};

export default Newsletter;