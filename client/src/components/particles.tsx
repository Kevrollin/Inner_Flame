import { useEffect, useRef } from 'react';
import { ParticleConfig } from '@/types';

interface ParticlesProps {
  config?: Partial<ParticleConfig>;
  className?: string;
}

export default function Particles({ config, className = '' }: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultConfig: ParticleConfig = {
    count: 50,
    colors: [
      'rgba(255, 107, 157, 0.8)',
      'rgba(78, 205, 196, 0.8)',
      'rgba(168, 230, 207, 0.8)',
    ],
    minSize: 2,
    maxSize: 4,
    speed: 15,
  };

  const particleConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleConfig.count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle absolute rounded-full pointer-events-none';
      
      // Random initial position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = '100vh';
      
      // Random size
      const size = Math.random() * (particleConfig.maxSize - particleConfig.minSize) + particleConfig.minSize;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Random color
      const color = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
      particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
      
      // Random animation delay and duration
      const animationDelay = Math.random() * 20;
      const animationDuration = Math.random() * 10 + particleConfig.speed;
      
      particle.style.animation = `particle ${animationDuration}s linear ${animationDelay}s infinite`;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Cleanup function
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [particleConfig]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}
