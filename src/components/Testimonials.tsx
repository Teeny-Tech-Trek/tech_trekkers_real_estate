
// import React, { useRef } from "react";

// interface TestimonialProps {
//   content: string;
//   author: string;
//   role: string;
//   gradient: string;
//   backgroundImage?: string;
// }

// const testimonials: TestimonialProps[] = [{
//   content: "Our virtual agents increased lead conversion by 45% in just two months. They handle initial inquiries while I focus on closing qualified prospects. Game changer!",
//   author: "Sarah Chen",
//   role: "Top Agent, Meridian Realty",
//   gradient: "from-blue-700 via-indigo-800 to-purple-900",
//   backgroundImage: "/background-section1.png"
// }, {
//   content: "Having virtual agents work nights and weekends means we never miss a lead. Our response time went from hours to seconds, and prospects love the instant engagement.",
//   author: "Michael Rodriguez",
//   role: "Broker/Owner, Rodriguez Properties",
//   gradient: "from-indigo-900 via-purple-800 to-orange-500",
//   backgroundImage: "/background-section2.png"
// }, {
//   content: "The CRM integration is seamless. Our virtual agents qualify leads, schedule showings, and update our pipeline automatically. It's like having a full-time assistant.",
//   author: "Dr. Amara Patel",
//   role: "Real Estate Developer, Patel Developments",
//   gradient: "from-purple-800 via-pink-700 to-red-500",
//   backgroundImage: "/background-section3.png"
// }, {
//   content: "As a smaller agency, we couldn't afford round-the-clock lead management. These virtual agents level the playing field against the big brokerages.",
//   author: "Jason Lee",
//   role: "Founder, Elite Home Solutions",
//   gradient: "from-orange-600 via-red-500 to-purple-600",
//   backgroundImage: "/background-section1.png"
// }];

// const TestimonialCard = ({
//   content,
//   author,
//   role,
//   backgroundImage = "/background-section1.png"
// }: TestimonialProps) => {
//   return <div className="bg-cover bg-center rounded-lg p-8 h-full flex flex-col justify-between text-white transform transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden" style={{
//     backgroundImage: `url('${backgroundImage}')`
//   }}>
//       <div className="absolute top-0 right-0 w-24 h-24 bg-white z-10"></div>
      
//       <div className="relative z-0">
//         <p className="text-xl mb-8 font-medium leading-relaxed pr-20">{`"${content}"`}</p>
//         <div>
//           <h4 className="font-semibold text-xl">{author}</h4>
//           <p className="text-white/80">{role}</p>
//         </div>
//       </div>
//     </div>;
// };

// const Testimonials = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);

//   return <section className="py-12 bg-white relative" id="testimonials" ref={sectionRef}> {/* Reduced from py-20 */}
//       <div className="section-container opacity-0 animate-on-scroll">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="pulse-chip">
//             <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
//             <span>Testimonials</span>
//           </div>
//         </div>
        
//         <h2 className="text-5xl font-display font-bold mb-12 text-left">Success Stories</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {testimonials.map((testimonial, index) => <TestimonialCard key={index} content={testimonial.content} author={testimonial.author} role={testimonial.role} gradient={testimonial.gradient} backgroundImage={testimonial.backgroundImage} />)}
//         </div>
//       </div>
//     </section>;
// };

// export default Testimonials;

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star, Sparkles } from "lucide-react";

const testimonials = [
  {
    content: "Our virtual agents increased lead conversion by 45% in just two months. They handle initial inquiries while I focus on closing qualified prospects. Game changer!",
    author: "Sarah Chen",
    role: "Top Agent, Meridian Realty",
    rating: 5
  },
  {
    content: "Having virtual agents work nights and weekends means we never miss a lead. Our response time went from hours to seconds, and prospects love the instant engagement.",
    author: "Michael Rodriguez",
    role: "Broker/Owner, Rodriguez Properties",
    rating: 5
  },
  {
    content: "The CRM integration is seamless. Our virtual agents qualify leads, schedule showings, and update our pipeline automatically. It's like having a full-time assistant.",
    author: "Dr. Amara Patel",
    role: "Real Estate Developer, Patel Developments",
    rating: 5
  },
  {
    content: "As a smaller agency, we couldn't afford round-the-clock lead management. These virtual agents level the playing field against the big brokerages.",
    author: "Jason Lee",
    role: "Founder, Elite Home Solutions",
    rating: 5
  }
];

const TestimonialCard = ({ content, author, role, rating = 5, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
      className="relative h-full flex flex-col justify-between group p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative z-10">
        {/* Star Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ))}
        </div>

        {/* Content */}
        <p className="text-base sm:text-lg font-sans leading-relaxed text-gray-700 mb-6">
          "{content}"
        </p>
      </div>

      {/* Author Info */}
      <div className="relative z-10 flex items-center gap-4 pt-6 border-t border-gray-200">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-lg shadow-lg font-sans">
          {author.split(' ').map(n => n[0]).join('')}
        </div>
        
        {/* Details */}
        <div>
          <h4 className="font-bold text-base sm:text-lg text-blue-900 font-sans">{author}</h4>
          <p className="text-sm text-gray-600 font-sans">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  return (
    <section 
      className="py-6 sm:py-10 lg:py-14 relative overflow-hidden bg-white" 
      id="testimonials"
    >
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-6 mb-6"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border-2 border-blue-900 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-default">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold shadow-md font-sans">
                06
              </span>
              <Sparkles className="w-4 h-4 text-blue-900" />
              <span className="text-sm font-bold text-blue-900 tracking-wide font-sans">
                Testimonials
              </span>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-900 via-blue-300 to-transparent"></div>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-sans font-black text-blue-900 mb-3">
                Success Stories
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-sans">
                See how agents are transforming their business with virtual assistants
              </p>
            </motion.div>

            {/* Stats badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="inline-flex items-center gap-2"
            >
              <div className="flex -space-x-1">
                <div className="w-8 h-8 rounded-full bg-blue-900"></div>
                <div className="w-8 h-8 rounded-full bg-blue-800"></div>
                <div className="w-8 h-8 rounded-full bg-blue-700"></div>
              </div>
              <span className="text-sm font-bold text-blue-900 font-sans">2,000+ Happy Agents</span>
            </motion.div>
          </div>
        </div>
        
        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              content={testimonial.content} 
              author={testimonial.author} 
              role={testimonial.role} 
              rating={testimonial.rating}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-black text-blue-900 font-sans">4.9/5 Average Rating</div>
              <div className="text-sm text-gray-700 font-sans">Based on 2,000+ reviews</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;