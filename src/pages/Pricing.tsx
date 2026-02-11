import React, { useEffect, useRef, useState, useMemo } from "react";
import { Check, Star, Zap, Crown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef([]);
  const faqTitleRef = useRef(null);
  const faqDescRef = useRef(null);
  const faqItemsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Use scroll detection to trigger animations only when visible
  const { isVisible, hasAnimated } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '50px',
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Only initialize animations when element is visible
  useEffect(() => {
    if (!isVisible) return;

    // Animate badge with 3D flip - Simplified for performance
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

    // Animate title with reduced 3D complexity
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

    // Animate description
    gsap.fromTo(
      descRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
      }
    );

    // Stagger animation for pricing cards - Reduced 3D for better performance
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
            delay: 0.15 + index * 0.08,
            ease: "power3.out",
          }
        );
      }
    });

    // Animation for FAQ title
    gsap.fromTo(
      faqTitleRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }
    );

    // Animation for FAQ description
    gsap.fromTo(
      faqDescRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power3.out",
      }
    );

    // Stagger animation for FAQ items
    gsap.fromTo(
      faqItemsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      }
    );

    // Cleanup: Kill ScrollTriggers on unmount to prevent memory leaks
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isVisible]);

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

  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for individual agents getting started",
      icon: Zap,
      popular: false,
      features: [
        "1 Virtual Avatar", 
        "Up to 100 leads/month",
        "Basic property management",
        "Email support",
        "Standard integrations",
        "Basic analytics",
        "1% commission on closed deals"
      ],
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional", 
      price: "$99",
      period: "/month",
      description: "Ideal for growing real estate teams",
      icon: Star,
      popular: true,
      features: [
        "3 Virtual Avatars",
        "Up to 500 leads/month", 
        "Advanced property management",
        "Priority support",
        "All CRM integrations",
        "Advanced analytics & reporting",
        "Team collaboration tools",
        "Custom avatar training",
        "1% commission on closed deals"
      ],
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large agencies and enterprises", 
      icon: Crown,
      popular: false,
      features: [
        "Unlimited Virtual Avatars",
        "Unlimited leads",
        "White-label solution",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security & compliance",
        "Multi-location support", 
        "Custom reporting",
        "Volume-based commission rates"
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <div 
      ref={sectionRef}
      className="min-h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
      id="pricing"
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

      {/* Header */}
      <div className="container mx-auto px-6 lg:px-12 py-16 md:py-24 text-center relative z-10" style={{ perspective: "1500px" }}>
      
        
        <h1 
          ref={titleRef}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight"
          style={{
            textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
            transform: `translateZ(100px)`,
          }}
        >
          Choose Your
          <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mt-2">
            Plan
          </span>
        </h1>
        
        <p 
          ref={descRef}
          className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium"
          style={{
            textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          Start converting more leads with AI-powered virtual sales agents. 
          All plans include our 1% commission structure on closed deals.
        </p>
      </div>

      <div className="py-16 md:py-20 px-6 lg:px-12 relative z-10">
        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10" style={{ perspective: "2000px" }}>
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div>
                <div
                  className={`relative backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-700 h-full ${
                    plan.popular 
                      ? 'ring-4 ring-white shadow-2xl' 
                      : ''
                  }`}
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

                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-white text-blue-900 text-center py-3 font-black text-sm z-20">
                      ⭐ Most Popular
                    </div>
                  )}
                  
                  <div className={`p-8 sm:p-10 relative z-10 ${plan.popular ? 'pt-16' : ''}`}>
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <motion.div 
                        className={`p-4 rounded-2xl shadow-2xl`}
                        style={{
                          background: plan.popular ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.1)",
                          border: "3px solid rgba(255, 255, 255, 0.2)",
                        }}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className={`w-8 h-8 ${
                          plan.popular ? 'text-blue-900' : 'text-white'
                        }`} strokeWidth={2.5} />
                      </motion.div>
                    </div>
                    
                    {/* Plan Name */}
                    <h3 
                      className="text-2xl sm:text-3xl font-black text-white text-center mb-3"
                      style={{
                        textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      {plan.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-center text-white/85 mb-6 text-sm md:text-base font-medium">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="text-center mb-8">
                      <span 
                        className="text-5xl sm:text-6xl font-black text-white"
                        style={{
                          textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xl text-white/80 font-bold">{plan.period}</span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex} 
                          className="flex items-start gap-3"
                        >
                          <div 
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center mt-0.5 shadow-lg"
                          >
                            <Check size={12} className="text-blue-900 stroke-[3]" />
                          </div>
                          <span className="text-sm md:text-base text-white/90 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a href="/login">
                      <motion.button
                        className={`w-full py-4 text-base font-black rounded-xl transition-all duration-300 ${
                          plan.popular
                            ? 'bg-white text-blue-900 shadow-2xl'
                            : 'border-2 border-white text-white'
                        }`}
                        style={{
                          background: plan.popular ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.05)",
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          background: plan.popular ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.15)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {plan.buttonText}
                      </motion.button>
                    </a>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-1000 ease-out"
                    style={{
                      background: "linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))",
                      boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-5xl mx-auto mt-32 sm:mt-40 relative z-10">
          <div className="text-center mb-16 sm:mb-20" style={{ perspective: "1500px" }}>
            <h2 
              ref={faqTitleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6"
              style={{
                textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              }}
            >
              Frequently Asked{" "}
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mt-2">
                Questions
              </span>
            </h2>
            <p 
              ref={faqDescRef}
              className="text-base md:text-lg lg:text-xl text-white/90 font-medium"
              style={{
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              Everything you need to know about our pricing and features
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "How does the commission structure work?",
                answer: "We charge a 1% commission only on deals that close through leads generated by our platform. This ensures we're aligned with your success."
              },
              {
                question: "Can I customize my avatars?",
                answer: "Yes! All plans include avatar customization. Professional and Enterprise plans offer advanced training and personality customization options."
              },
              {
                question: "What CRM integrations are available?",
                answer: "We integrate with HubSpot, Salesforce, Zoho, and most major real estate CRMs. Enterprise plans include custom integration development."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! Start with a 14-day free trial on any plan. No credit card required to begin."
              }
            ].map((faq, idx) => (
              <motion.div 
                key={idx}
                ref={(el) => (faqItemsRef.current[idx] = el)}
                className="group p-8 rounded-2xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                whileHover={{ 
                  scale: 1.02,
                  background: "rgba(255, 255, 255, 0.08)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <h3 
                  className="text-xl sm:text-2xl font-bold text-white mb-3"
                  style={{
                    textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {faq.question}
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-white/85 leading-relaxed font-medium">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;