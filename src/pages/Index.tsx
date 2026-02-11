
import React, { useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HumanoidSection from "@/components/HumanoidSection";
import SpecsSection from "@/components/SpecsSection";
import DetailsSection from "@/components/DetailsSection";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import MadeByHumans from "@/components/MadeByHumans";
import Footer from "@/components/Footer";
import Pricing from "./Pricing";

const Index = () => {
  // Set up smooth anchor link scrolling
  useEffect(() => {
    // Handle smooth scroll for anchor links with better performance
    const handleAnchorClick = (e: Event) => {
      const anchor = e.target as HTMLAnchorElement;
      const href = anchor.getAttribute('href');
      
      if (!href?.startsWith('#')) return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (!targetElement) return;
      
      // Increased offset to account for mobile nav
      const offset = window.innerWidth < 768 ? 100 : 80;
      const top = targetElement.offsetTop - offset;
      
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    };

    // Attach event listener to document for all anchor links
    document.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'A') {
        handleAnchorClick(e);
      }
    });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HumanoidSection />
        <SpecsSection />
        <DetailsSection />
        <ImageShowcaseSection />
        <Features />
        {/* <Testimonials /> */}
        <Pricing />
        <Newsletter />
        {/* <MadeByHumans /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
