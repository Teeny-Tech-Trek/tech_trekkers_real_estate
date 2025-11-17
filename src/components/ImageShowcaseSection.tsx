import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import eStateVideo from "../imges/ai agent final animation video.mp4"

const ImageShowcaseSection = () => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress || 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  // Intersection Observer for autoplay on scroll
  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When video comes into view, play it (muted for autoplay to work)
            video.muted = true; // Ensure muted for autoplay
            setIsMuted(true);
            video.play().catch(err => {
              console.log('Autoplay prevented:', err);
              // If autoplay fails, user will need to click play button
            });
          } else {
            // When video leaves view, pause it
            video.pause();
          }
        });
      },
      {
        threshold: 0.3, // Play when 30% of video is visible (earlier trigger)
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const features = [
    "24/7 Lead Engagement",
    "Smart Qualification",
    "Auto Scheduling",
    "CRM Integration"
  ];

  return (
    <section 
    id="showcase"
      className="relative w-full py-12 md:py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 50%, #1e3a8a 100%)',
      }}
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

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Content Section */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-semibold text-blue-300">AI-Powered Demo</span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              See Your Virtual Agent
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mt-2">
                in Action
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Watch how our AI-powered avatars engage with prospects, qualify leads, 
              and schedule visits while you focus on closing deals.
            </p>
          </motion.div>

          {/* Video Player */}
          <motion.div
            ref={videoContainerRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative group"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))',
                padding: '3px',
              }}
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Video Container */}
                <div className="relative aspect-video bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    src={eStateVideo}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {/* Live Badge */}
                  <motion.div
                    className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md z-20"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800">LIVE DEMO</span>
                    </div>
                  </motion.div>

                  {/* Custom Controls - Always visible */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" fill="white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                          )}
                        </button>

                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>

                      <button
                        onClick={handleFullscreen}
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                      >
                        <Maximize className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
              style={{
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.4), transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-sm"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(59, 130, 246, 0.15)',
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-white">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;