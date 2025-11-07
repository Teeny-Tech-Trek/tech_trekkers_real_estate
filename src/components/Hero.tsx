import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, TrendingUp, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import robotImg from "../imges/ChatGPT_Image_Nov_6__2025__02_34_35_PM-removebg-preview.png"

const Hero = () => {
  const containerRef = useRef(null);
  const robotRef = useRef(null);
  const robotInnerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP Scale Animation on Load
  useEffect(() => {
    if (!robotRef.current) return;

    // Scale from 0 to 100% with bounce effect
    gsap.fromTo(
      robotRef.current,
      {
        scale: 0,
        opacity: 0,
        rotationY: -180,
      },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 2,
        delay: 0.5,
        ease: "elastic.out(1, 0.6)",
      }
    );
  }, []);

  // GSAP Smooth Mouse Movement
  useEffect(() => {
    if (isMobile || !robotInnerRef.current) return;

    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate rotation based on mouse position (reduced intensity)
      const xRotation = ((e.clientY - centerY) / rect.height) * -10; // Max 10 degrees
      const yRotation = ((e.clientX - centerX) / rect.width) * 10; // Max 10 degrees

      // GSAP smooth animation with slow easing
      gsap.to(robotInnerRef.current, {
        rotationX: xRotation,
        rotationY: yRotation,
        duration: 0.15, // Slower movement
        ease: "power3.out", // Smooth easing
      });
    };

    const handleMouseLeave = () => {
      // Reset to original position smoothly
      gsap.to(robotInnerRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      containerRef.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile]);

  // Floating particles
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

  return (
    <section
      className="overflow-hidden relative min-h-screen flex items-center"
      id="hero"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
        padding: isMobile ? "100px 12px 40px" : "120px 20px 60px",
      }}
      ref={containerRef}
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

      {/* Floating particles */}
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            className="w-full lg:w-1/2 space-y-8"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl group cursor-default">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-900 font-black text-sm shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  AI
                </motion.div>
                <Bot className="w-5 h-5 text-white" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Powered by Advanced AI
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] font-black mb-6">
                <span className="block text-white drop-shadow-2xl">
                  AI Agents for
                </span>
                <span className="block mt-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Real Estate
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/80 font-medium">
                That Work 24/7
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg sm:text-xl leading-relaxed text-white/90 font-medium max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Transform your real estate business with intelligent AI agents that handle customer queries, schedule viewings, and close deals while you sleep.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.a
                href="#get-access"
                className="group relative inline-flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <span className="relative flex items-center justify-center gap-3 px-8 py-5 bg-white rounded-full text-blue-900 font-black text-lg shadow-2xl border-2 border-white/20">
                  Get Started Free
                  <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.a>

              <motion.a
                href="#demo"
                className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-full text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Watch Demo
              </motion.a>
            </motion.div>

            {/* Stats */}
            {/* <motion.div
              className="grid grid-cols-3 gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { icon: Bot, value: "24/7", label: "Active" },
                { icon: TrendingUp, value: "10x", label: "Faster" },
                { icon: Sparkles, value: "95%", label: "Accuracy" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-center shadow-xl">
                    <stat.icon className="w-6 h-6 text-white mx-auto mb-2" />
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-white/70 font-semibold">{stat.label}</div>
                  </div>
                </motion.div> */}
              {/* ))} */}
            {/* </motion.div> */}

            {/* Trust Badge */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-blue-900 shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.3, zIndex: 10 }}
                  >
                    <span className="text-white text-xs font-bold">{i}</span>
                  </motion.div>
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-sm">Trusted by 2,000+ Agents</p>
                <p className="text-white/60 text-xs">Join the AI revolution</p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - 3D ROBOT WITH GSAP */}
          <div className="w-full lg:w-1/2 relative">
            <div 
              className="relative" 
              style={{ perspective: '1500px' }}
              ref={robotRef}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-12 rounded-full blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* 3D Robot Container with GSAP */}
              <div
                ref={robotInnerRef}
                className="relative"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                {/* Robot Image with glassmorphism frame */}
                <div className="relative rounded-3xl overflow-hidden   p-8">
                  <img
                    src={robotImg}
                    alt="AI Agent Robot"
                    className="w-full h-auto relative z-10 drop-shadow-2xl"
                  />
                  
                  {/* Inner glow */}
                  <div className="absolute inset-0  rounded-3xl"></div>
                </div>

                {/* Live Status Badge */}
                <motion.div
                  className="absolute top-8 right-8 px-6 py-3 bg-white rounded-full shadow-2xl border-2 border-blue-900"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-black text-blue-900">Live Now</span>
                  </div>
                </motion.div>

                {/* AI Status Card */}
                {/* <motion.div
                  className="absolute bottom-8 left-8 px-6 py-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-900/10"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-blue-900">Active Agent</div>
                      <div className="text-xs text-blue-900/60 font-medium">Processing queries...</div>
                    </div>
                  </div>
                </motion.div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-950/50 to-transparent pointer-events-none"></div> */}
    </section>
  );
};

export default Hero;
