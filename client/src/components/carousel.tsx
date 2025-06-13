import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CarouselSlide } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
  slides: CarouselSlide[];
  autoAdvance?: boolean;
  interval?: number;
  onSlideAction?: (action: string, slide: CarouselSlide) => void;
}

export default function Carousel({ 
  slides, 
  autoAdvance = true, 
  interval = 5000,
  onSlideAction 
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoAdvance || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoAdvance, interval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleAction = (slide: CarouselSlide) => {
    onSlideAction?.(slide.ctaAction, slide);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Background Image */}
          {currentSlide !== 0 && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-purple-900/70 to-blue-900/80" />
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl px-6">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold gradient-text mb-6 animate-float"
            >
              {slides[currentSlide].title}
            </motion.h2>
            
            {slides[currentSlide].subtitle && (
              <motion.h3
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl md:text-4xl font-semibold text-cyan-300 mb-4"
              >
                {slides[currentSlide].subtitle}
              </motion.h3>
            )}
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button
                onClick={() => handleAction(slides[currentSlide])}
                className="glow-button px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
              >
                {slides[currentSlide].ctaText}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-opacity duration-300 ${
                index === currentSlide 
                  ? 'bg-pink-500 opacity-100' 
                  : 'bg-white opacity-30 hover:opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
