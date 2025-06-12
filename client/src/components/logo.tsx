import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <motion.div 
      className={`${sizes[size]} relative ${className}`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient1)"
          strokeWidth="3"
          fill="none"
          className="animate-pulse-soft"
        />
        
        {/* Inner flame */}
        <path
          d="M50 20 C40 30, 40 40, 45 50 C40 60, 45 70, 50 75 C55 70, 60 60, 55 50 C60 40, 60 30, 50 20 Z"
          fill="url(#gradient2)"
          className="animate-float"
        />
        
        {/* Center core */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="url(#gradient3)"
          className="animate-glow"
        />
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="gradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4ecdc4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a8e6cf" stopOpacity="0.4" />
          </radialGradient>
          
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b9d" />
            <stop offset="50%" stopColor="#ff8a80" />
            <stop offset="100%" stopColor="#4ecdc4" />
          </linearGradient>
          
          <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ff6b9d" />
            <stop offset="100%" stopColor="#4ecdc4" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}