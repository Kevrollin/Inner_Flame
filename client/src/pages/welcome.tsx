import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Carousel from '@/components/carousel';
import Particles from '@/components/particles';
import { CarouselSlide } from '@/types';
import { audioManager } from '@/lib/audio';
import { authService } from '@/lib/supabase';

export default function Welcome() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const user = authService.getUser();
    if (user) {
      setLocation('/dashboard');
    }
  }, [setLocation]);

  const slides: CarouselSlide[] = [
    {
      id: '1',
      title: 'Inner Flame',
      subtitle: '',
      description: 'Embark on a transformative journey through the landscapes of your mind',
      bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
      ctaText: 'Start Your Journey',
      ctaAction: 'start',
    },
    {
      id: '2',
      title: 'Discover Your Truth',
      subtitle: '',
      description: 'Navigate through emotional realms and unlock the power of self-awareness',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
      ctaText: 'Learn More',
      ctaAction: 'learn',
    },
    {
      id: '3',
      title: 'Transform Within',
      subtitle: '',
      description: 'Every flame starts small. Ignite your inner strength and overcome life\'s challenges',
      bgImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080',
      ctaText: 'Begin Transformation',
      ctaAction: 'transform',
    },
  ];

  const handleSlideAction = (action: string, slide: CarouselSlide) => {
    // Play UI sound
    audioManager.playUISound(880, 200);

    switch (action) {
      case 'start':
      case 'transform':
        setLocation('/auth');
        break;
      case 'learn':
        // Scroll to learn more section or show modal
        document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        setLocation('/auth');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Particles */}
      <Particles />
      
      {/* Main Carousel Section */}
      <section className="relative z-10">
        <Carousel 
          slides={slides} 
          onSlideAction={handleSlideAction}
          autoAdvance={true}
          interval={6000}
        />
      </section>

      {/* Learn More Section */}
      <section id="learn-more" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold gradient-text mb-8">
            Your Journey to Self-Discovery
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="glass-morphism p-6 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                <i className="fas fa-heart text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-pink-400 mb-3">Emotional Growth</h3>
              <p className="text-gray-300">
                Navigate through different emotional realms and transform your relationship with fear, doubt, and anxiety.
              </p>
            </div>

            <div className="glass-morphism p-6 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <i className="fas fa-compass text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-3">Interactive Journey</h3>
              <p className="text-gray-300">
                Experience immersive 3D environments and interactive challenges designed to promote self-reflection.
              </p>
            </div>

            <div className="glass-morphism p-6 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                <i className="fas fa-journal-whills text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-400 mb-3">Personal Insights</h3>
              <p className="text-gray-300">
                Keep a digital journal of your discoveries and track your progress through each realm of growth.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setLocation('/auth')}
              className="glow-button px-8 py-3 rounded-full font-semibold text-lg"
            >
              Begin Your Journey
            </button>
            <button 
              onClick={() => setLocation('/auth')}
              className="glow-button px-8 py-3 rounded-full font-semibold text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 animate-pulse-soft" />
            <h3 className="text-2xl font-bold gradient-text">Inner Flame</h3>
          </div>
          <p className="text-gray-400 mb-6">Illuminate your path to self-discovery</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
              <i className="fab fa-twitter text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
              <i className="fab fa-instagram text-xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
              <i className="fab fa-discord text-xl" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
