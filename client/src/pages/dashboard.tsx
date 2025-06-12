import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import RealmCard from '@/components/realm-card';
import ReflectionJournal from '@/components/reflection-journal';
import Particles from '@/components/particles';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MentalRealm, UserState } from '@/types';
import { authService } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserState>({ isAuthenticated: false });

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser({
        ...currentUser,
        isAuthenticated: true,
      });
    } else {
      setLocation('/auth');
    }
  }, [setLocation]);

  // Fetch user progress
  const { data: userProgress, isLoading } = useQuery({
    queryKey: [`/api/progress/${user.id}`],
    enabled: !!user.id,
  });

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!userProgress || userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum: number, realm: any) => sum + realm.progress, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  // Mental realms configuration
  const mentalRealms: MentalRealm[] = [
    {
      id: 'fear',
      name: 'Fear',
      description: 'Face your deepest fears and transform them into strength.',
      icon: 'fa-ghost',
      color: 'text-pink-400',
      bgImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      progress: userProgress?.find((p: any) => p.realmId === 'fear')?.progress || 0,
      isUnlocked: userProgress?.find((p: any) => p.realmId === 'fear')?.isUnlocked || true,
    },
    {
      id: 'doubt',
      name: 'Doubt',
      description: 'Question your limiting beliefs and discover your truth.',
      icon: 'fa-question',
      color: 'text-cyan-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      progress: userProgress?.find((p: any) => p.realmId === 'doubt')?.progress || 0,
      isUnlocked: userProgress?.find((p: any) => p.realmId === 'doubt')?.isUnlocked || false,
    },
    {
      id: 'anxiety',
      name: 'Anxiety',
      description: 'Calm the storms within and find your center.',
      icon: 'fa-wind',
      color: 'text-yellow-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      progress: userProgress?.find((p: any) => p.realmId === 'anxiety')?.progress || 0,
      isUnlocked: userProgress?.find((p: any) => p.realmId === 'anxiety')?.isUnlocked || false,
    },
    {
      id: 'self-worth',
      name: 'Self-Worth',
      description: 'Discover your inherent value and embrace self-love.',
      icon: 'fa-gem',
      color: 'text-purple-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      progress: userProgress?.find((p: any) => p.realmId === 'self-worth')?.progress || 0,
      isUnlocked: userProgress?.find((p: any) => p.realmId === 'self-worth')?.isUnlocked || false,
    },
    {
      id: 'forgiveness',
      name: 'Forgiveness',
      description: 'Release the past and step into healing light.',
      icon: 'fa-dove',
      color: 'text-green-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      progress: userProgress?.find((p: any) => p.realmId === 'forgiveness')?.progress || 0,
      isUnlocked: userProgress?.find((p: any) => p.realmId === 'forgiveness')?.isUnlocked || false,
    },
    {
      id: 'wisdom',
      name: 'Wisdom',
      description: 'Integrate your journey and become your wisest self.',
      icon: 'fa-eye',
      color: 'text-indigo-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      progress: userProgress?.find((p: any) => p.realmId === 'wisdom')?.progress || 0,
      isUnlocked: userProgress?.find((p: any) => p.realmId === 'wisdom')?.isUnlocked || false,
    },
  ];

  const handleEnterRealm = (realm: MentalRealm) => {
    // For now, just show a placeholder message
    // In a full implementation, this would navigate to the 3D realm experience
    console.log(`Entering ${realm.name} realm...`);
    // You could navigate to a specific realm page or open a modal
  };

  const overallProgress = calculateOverallProgress();

  const inspirationalQuotes = [
    "Doubt is just a shadow - you are the light.",
    "Every step forward is a victory, no matter how small.",
    "Your inner flame burns brighter with each challenge you face.",
    "Growth happens in the spaces between comfort and fear.",
    "You are exactly where you need to be in your journey.",
  ];

  const currentQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];

  if (!user.isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen py-20">
      {/* Background Particles */}
      <Particles config={{ count: 40, speed: 12 }} />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Header with Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold gradient-text mb-6 animate-slideUp">
            Your Inner Journey
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Clarity Meter</span>
              <span className="text-pink-400 font-semibold text-lg">
                {overallProgress}%
              </span>
            </div>
            
            <Progress 
              value={overallProgress} 
              className="h-4 mb-4"
            />
            
            <p className="text-gray-400 italic text-lg">
              "{currentQuote}"
            </p>
          </div>
        </motion.div>

        {/* Mental Realms Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold gradient-text text-center mb-8">
            Mental Realms
          </h3>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="realm-card p-6 rounded-2xl animate-pulse">
                  <div className="h-32 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentalRealms.map((realm, index) => (
                <motion.div
                  key={realm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RealmCard 
                    realm={realm} 
                    onEnter={handleEnterRealm}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Reflection Journal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ReflectionJournal />
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-morphism p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold gradient-text mb-4">
              Continue Your Journey
            </h3>
            <p className="text-gray-300 mb-6">
              Ready to explore deeper into your consciousness? 
              Choose a realm that calls to you today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="glow-button px-6 py-3 rounded-full"
                onClick={() => {
                  const nextRealm = mentalRealms.find(r => r.isUnlocked && r.progress < 100);
                  if (nextRealm) handleEnterRealm(nextRealm);
                }}
              >
                Continue Where You Left Off
              </Button>
              <Button 
                variant="outline"
                className="glow-button px-6 py-3 rounded-full"
                onClick={() => {
                  document.getElementById('realm-grid')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Explore All Realms
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
