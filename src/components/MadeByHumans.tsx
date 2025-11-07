import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const MadeByHumans = () => {
  return (
    <section 
      id="made-by-humans" 
      className="w-full py-20 relative overflow-hidden bg-blue-900"
    >
      <div className="container px-6 mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-6 mb-12"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-800/50 border-[1px] border-blue-700">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-semibold text-blue-100">Built For You</span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-blue-700 via-blue-800 to-transparent"></div>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          className="w-full rounded-2xl overflow-hidden border-[1px] border-blue-700 relative group hover:border-blue-600 transition-all duration-500 bg-blue-900/50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Background with gradient overlay */}
          <div 
            className="relative bg-no-repeat bg-cover bg-center px-6 sm:px-10 py-16 sm:py-20 min-h-[300px] sm:min-h-[350px] flex flex-col justify-center items-center text-center"
          >
            {/* Decorative gradient blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl"></div>
            
            {/* Main Headline */}
            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                Made for Agents
                <br />
                <span className="inline-block mt-1 text-blue-300">
                  & Builders
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-blue-200 max-w-xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                Designed by real estate professionals, for real estate professionals
              </motion.p>
            </div>

            {/* Decorative shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MadeByHumans;