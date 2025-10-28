import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 3D image tilt effect
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02,1.02,1.02)`;
    };
    const resetTransform = () => {
      if (imageRef.current)
        imageRef.current.style.transform =
          "perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", resetTransform);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", resetTransform);
      }
    };
  }, [isMobile]);

  // Simple parallax on scroll
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll(".parallax");
      elements.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-speed") || "0.1");
        (el as HTMLElement).style.setProperty(
          "--parallax-y",
          `${-scrollY * speed}px`
        );
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <section
      className="overflow-hidden relative bg-cover"
      id="hero"
      style={{
        backgroundImage: 'url("/Header-background.webp")',
        backgroundPosition: "center 30%",
        padding: isMobile ? "100px 12px 40px" : "120px 20px 60px",
        filter: "hue-rotate(180deg) saturate(150%)",
      }}
    >
      <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-pulse-gradient opacity-20 blur-3xl rounded-full"></div>

      <div className="container px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          {/* LEFT CONTENT */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="pulse-chip mb-3 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                01
              </span>
              <span>Real Estate Innovation</span>
            </motion.div>

            <motion.h1
              className="section-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Virtual Sales Agents<br className="hidden sm:inline" />
              That Never Sleep
            </motion.h1>

            <motion.p
              className="section-subtitle mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed text-gray-950 font-normal text-base sm:text-lg text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Deploy AI-powered avatars to capture leads, manage properties, and
              close deals 24/7 while you focus on what matters most.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <a
                href="#get-access"
                className="flex items-center justify-center group w-full sm:w-auto text-center"
                style={{
                  backgroundColor: "#FE5C02",
                  borderRadius: "1440px",
                  color: "#FFFFFF",
                  fontSize: "14px",
                  lineHeight: "20px",
                  padding: "16px 24px",
                  border: "1px solid white",
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE IMAGE with motion float */}
          <motion.div
            className="w-full lg:w-1/2 relative mt-6 lg:mt-0"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative transition-all duration-500 ease-out overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl"
            >
              <img
                ref={imageRef}
                src="/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png"
                alt="Virtual Sales Agent Avatar"
                className="w-full h-auto object-cover transition-transform duration-500 ease-out"
                style={{ transformStyle: "preserve-3d" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'url("/hero-image.jpg")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  mixBlendMode: "overlay",
                  opacity: 0.5,
                }}
              ></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div
        className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-pulse-100/30 rounded-full blur-3xl -z-10 parallax"
        data-speed="0.05"
      ></div>
    </section>
  );
};

export default Hero;
