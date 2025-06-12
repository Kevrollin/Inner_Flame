import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import RealmCard from '@/components/realm-card';
import RealmExperience from '@/components/realm-experience';
import ReflectionJournal from '@/components/reflection-journal';
import Particles from '@/components/particles';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MentalRealm, UserState } from '@/types';
import { authService } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserState>({ isAuthenticated: false });
  const [selectedRealm, setSelectedRealm] = useState<MentalRealm | null>(null);
  const [showHeadStartDialog, setShowHeadStartDialog] = useState(false);

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
  const { data: userProgress, isLoading, refetch } = useQuery({
    queryKey: [`/api/progress/${user.id}`],
    enabled: !!user.id,
  });

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!userProgress || !Array.isArray(userProgress) || userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum: number, realm: any) => sum + realm.progress, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  // Helper function to get realm data safely
  const getRealmData = (realmId: string) => {
    if (!Array.isArray(userProgress)) return { progress: 0, isUnlocked: realmId === 'fear', isCompleted: false };
    const realmData = userProgress.find((p: any) => p.realmId === realmId);
    return {
      progress: realmData?.progress || 0,
      isUnlocked: realmData?.isUnlocked || (realmId === 'fear'),
      isCompleted: realmData?.isCompleted || false
    };
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
      ...getRealmData('fear'),
    },
    {
      id: 'doubt',
      name: 'Doubt',
      description: 'Question your limiting beliefs and discover your truth.',
      icon: 'fa-question',
      color: 'text-cyan-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      ...getRealmData('doubt'),
    },
    {
      id: 'anxiety',
      name: 'Anxiety',
      description: 'Calm the storms within and find your center.',
      icon: 'fa-wind',
      color: 'text-yellow-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      ...getRealmData('anxiety'),
    },
    {
      id: 'self-worth',
      name: 'Self-Worth',
      description: 'Discover your inherent value and embrace self-love.',
      icon: 'fa-gem',
      color: 'text-purple-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      ...getRealmData('self-worth'),
    },
    {
      id: 'forgiveness',
      name: 'Forgiveness',
      description: 'Release the past and step into healing light.',
      icon: 'fa-dove',
      color: 'text-green-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      ...getRealmData('forgiveness'),
    },
    {
      id: 'wisdom',
      name: 'Wisdom',
      description: 'Integrate your journey and become your wisest self.',
      icon: 'fa-eye',
      color: 'text-indigo-400',
      bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400',
      ...getRealmData('wisdom'),
    },
  ];

  const handleEnterRealm = (realm: MentalRealm) => {
    setSelectedRealm(realm);
  };

  const handleRealmComplete = () => {
    setSelectedRealm(null);
    refetch();
  };

  const handleHeadStart = (realm: MentalRealm) => {
    setSelectedRealm(realm);
    setShowHeadStartDialog(false);
  };

  // Find the current realm user is working on
  const getCurrentRealm = () => {
    return mentalRealms.find(realm => realm.isUnlocked && !realm.isCompleted && realm.progress < 100) || mentalRealms[0];
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

        {/* Enhanced Continue Your Journey */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Continue Journey */}
            <div className="glass-morphism p-8 rounded-2xl">
              <h3 className="text-2xl font-bold gradient-text mb-4">
                Continue Your Journey
              </h3>
              <p className="text-gray-300 mb-6">
                Pick up where you left off and continue growing your inner flame.
              </p>
              <div className="space-y-4">
                <Button 
                  className="w-full glow-button px-6 py-3 rounded-full"
                  onClick={() => {
                    const currentRealm = getCurrentRealm();
                    if (currentRealm) handleEnterRealm(currentRealm);
                  }}
                >
                  <i className="fas fa-play mr-2" />
                  Continue {getCurrentRealm()?.name} Realm
                </Button>
                <Button 
                  variant="outline"
                  className="w-full glow-button px-6 py-3 rounded-full"
                  onClick={() => {
                    document.getElementById('realms-section')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                >
                  <i className="fas fa-compass mr-2" />
                  Explore All Realms
                </Button>
              </div>
            </div>

            {/* Head Start Option */}
            <div className="glass-morphism p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                Head Start
              </h3>
              <p className="text-gray-300 mb-6">
                Want to jump to a specific realm? Skip the procedural progression and dive into what calls to you most.
              </p>
              <Button 
                className="w-full glow-button px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                onClick={() => setShowHeadStartDialog(true)}
              >
                <i className="fas fa-rocket mr-2" />
                Choose Any Realm
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Head Start Dialog */}
        <Dialog open={showHeadStartDialog} onOpenChange={setShowHeadStartDialog}>
          <DialogContent className="glass-morphism border-2 border-cyan-500/30 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold gradient-text">
                Choose Your Realm
              </DialogTitle>
              <p className="text-gray-400">
                Select any realm to begin your journey there. No prerequisites required.
              </p>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {mentalRealms.map((realm) => (
                <Button
                  key={realm.id}
                  variant="outline"
                  className="p-4 h-auto flex flex-col items-start space-y-2 text-left hover:border-cyan-400 transition-colors"
                  onClick={() => handleHeadStart(realm)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <i className={`fas ${realm.icon} ${realm.color} text-xl`} />
                    <span className="font-semibold">{realm.name}</span>
                  </div>
                  <p className="text-sm text-gray-400">{realm.description}</p>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Realm Experience Modal */}
        {selectedRealm && (
          <RealmExperience
            realm={selectedRealm}
            onComplete={handleRealmComplete}
            onClose={() => setSelectedRealm(null)}
          />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
