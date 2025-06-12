import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MentalRealm } from '@/types';
import { authService } from '@/lib/supabase';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface RealmExperienceProps {
  realm: MentalRealm;
  onComplete?: () => void;
  onClose?: () => void;
}

interface LessonContent {
  id: string;
  title: string;
  content: string;
  type: 'education' | 'exercise' | 'reflection';
  duration: number;
}

export default function RealmExperience({ realm, onComplete, onClose }: RealmExperienceProps) {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const { toast } = useToast();
  const user = authService.getUser();

  // Educational content for each realm
  const realmLessons: Record<string, LessonContent[]> = {
    fear: [
      {
        id: 'fear-1',
        title: 'Understanding Fear',
        content: 'Fear is a natural emotion designed to protect us. However, when fear becomes overwhelming, it can limit our growth and potential. Let\'s explore the nature of fear and learn to transform it into courage.',
        type: 'education',
        duration: 300
      },
      {
        id: 'fear-2',
        title: 'Breathing Exercise',
        content: 'Take a deep breath in for 4 counts, hold for 4 counts, and exhale for 6 counts. This technique activates your parasympathetic nervous system, naturally reducing fear and anxiety.',
        type: 'exercise',
        duration: 180
      },
      {
        id: 'fear-3',
        title: 'Facing Your Fears',
        content: 'What is one fear that has been holding you back? Write it down and imagine yourself moving through it with confidence and strength.',
        type: 'reflection',
        duration: 240
      }
    ],
    doubt: [
      {
        id: 'doubt-1',
        title: 'The Nature of Self-Doubt',
        content: 'Self-doubt often stems from past experiences and limiting beliefs. Recognizing these patterns is the first step toward building unshakeable confidence.',
        type: 'education',
        duration: 280
      },
      {
        id: 'doubt-2',
        title: 'Affirmation Practice',
        content: 'Repeat after each statement: "I am capable", "I trust my decisions", "I believe in my abilities". Feel the truth of these words resonate within you.',
        type: 'exercise',
        duration: 200
      },
      {
        id: 'doubt-3',
        title: 'Evidence of Your Strength',
        content: 'List three achievements you\'re proud of, no matter how small. These are proof of your capabilities and inner strength.',
        type: 'reflection',
        duration: 300
      }
    ],
    anxiety: [
      {
        id: 'anxiety-1',
        title: 'Understanding Anxiety',
        content: 'Anxiety is your mind\'s way of preparing for potential threats. While this can be helpful, excessive anxiety can overwhelm us. Learning to calm your nervous system is key.',
        type: 'education',
        duration: 320
      },
      {
        id: 'anxiety-2',
        title: 'Grounding Technique',
        content: 'Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This brings you back to the present moment.',
        type: 'exercise',
        duration: 240
      },
      {
        id: 'anxiety-3',
        title: 'Creating Your Safe Space',
        content: 'Imagine a place where you feel completely safe and calm. Describe this space in detail and remember you can return here in your mind whenever you need peace.',
        type: 'reflection',
        duration: 260
      }
    ],
    'self-worth': [
      {
        id: 'worth-1',
        title: 'Your Inherent Value',
        content: 'Your worth is not determined by achievements, others\' opinions, or external validation. You are valuable simply because you exist.',
        type: 'education',
        duration: 290
      },
      {
        id: 'worth-2',
        title: 'Self-Compassion Practice',
        content: 'Place your hand on your heart and speak to yourself as you would to a beloved friend. Offer yourself the same kindness and understanding.',
        type: 'exercise',
        duration: 220
      },
      {
        id: 'worth-3',
        title: 'Celebrating Yourself',
        content: 'Write about a quality you possess that makes you unique and valuable. How has this quality helped you or others?',
        type: 'reflection',
        duration: 280
      }
    ],
    forgiveness: [
      {
        id: 'forgiveness-1',
        title: 'The Power of Forgiveness',
        content: 'Forgiveness is not about excusing harmful behavior, but about freeing yourself from the burden of resentment. It\'s a gift you give yourself.',
        type: 'education',
        duration: 310
      },
      {
        id: 'forgiveness-2',
        title: 'Loving-Kindness Meditation',
        content: 'Send thoughts of loving-kindness first to yourself, then to loved ones, neutral people, difficult people, and finally to all beings everywhere.',
        type: 'exercise',
        duration: 300
      },
      {
        id: 'forgiveness-3',
        title: 'Letter of Release',
        content: 'Write a letter to someone you need to forgive (including yourself). You don\'t need to send it - this is for your healing.',
        type: 'reflection',
        duration: 360
      }
    ],
    wisdom: [
      {
        id: 'wisdom-1',
        title: 'Integration and Wisdom',
        content: 'True wisdom comes from integrating all aspects of your experience - light and shadow, joy and pain. You are becoming whole.',
        type: 'education',
        duration: 340
      },
      {
        id: 'wisdom-2',
        title: 'Mindfulness Practice',
        content: 'Sit quietly and observe your thoughts without judgment. Notice how they arise and pass away like clouds in the sky of your awareness.',
        type: 'exercise',
        duration: 360
      },
      {
        id: 'wisdom-3',
        title: 'Your Wisdom Journey',
        content: 'Reflect on how you\'ve grown through your journey in Inner Flame. What wisdom would you share with someone just beginning their path?',
        type: 'reflection',
        duration: 400
      }
    ]
  };

  const lessons = realmLessons[realm.id] || [];
  const currentLessonContent = lessons[currentLesson];

  useEffect(() => {
    // Start lesson timer
    if (currentLessonContent && lessonProgress < 100) {
      const timer = setInterval(() => {
        setLessonProgress(prev => {
          const increment = 100 / (currentLessonContent.duration / 1000);
          return Math.min(prev + increment, 100);
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentLesson, currentLessonContent]);

  const handleNextLesson = async () => {
    if (currentLessonContent.type === 'reflection' && !userResponse.trim()) {
      toast({
        title: 'Reflection Required',
        description: 'Please complete your reflection before continuing.',
        variant: 'destructive',
      });
      return;
    }

    // Save reflection if applicable
    if (currentLessonContent.type === 'reflection' && userResponse.trim() && user) {
      try {
        await fetch('/api/reflections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            realmId: realm.id,
            content: userResponse,
            metadata: { lessonId: currentLessonContent.id }
          })
        });
      } catch (error) {
        console.error('Failed to save reflection:', error);
      }
    }

    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
      setLessonProgress(0);
      setUserResponse('');
    } else {
      // Complete the realm
      await completeRealm();
    }
  };

  const completeRealm = async () => {
    if (!user) return;

    try {
      // Update user progress
      const progressUpdate = {
        progress: 100,
        isCompleted: true,
        completedAt: new Date().toISOString()
      };

      await fetch(`/api/progress/${user.id}/${realm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressUpdate)
      });

      // Unlock next realm
      const realmOrder = ['fear', 'doubt', 'anxiety', 'self-worth', 'forgiveness', 'wisdom'];
      const currentIndex = realmOrder.indexOf(realm.id);
      if (currentIndex < realmOrder.length - 1) {
        const nextRealmId = realmOrder[currentIndex + 1];
        await fetch(`/api/progress/${user.id}/${nextRealmId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isUnlocked: true })
        });
      }

      queryClient.invalidateQueries({ queryKey: [`/api/progress/${user.id}`] });
      setIsCompleted(true);

      toast({
        title: 'Realm Completed!',
        description: `You have successfully completed the ${realm.name} realm. Your inner flame burns brighter.`,
      });

      setTimeout(() => {
        onComplete?.();
      }, 2000);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <Card className="glass-morphism border-2 border-green-500/50 max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center"
            >
              <i className="fas fa-check text-white text-3xl" />
            </motion.div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              {realm.name} Realm Completed!
            </h3>
            <p className="text-gray-300 mb-6">
              Your inner flame has grown stronger. You have gained new wisdom and tools for your journey.
            </p>
            <Button onClick={onComplete} className="glow-button px-6 py-2 rounded-full">
              Continue Journey
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    >
      <Card className="glass-morphism border-2 border-pink-500/30 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold gradient-text">
                {realm.name} Realm
              </CardTitle>
              <p className="text-gray-400 mt-1">
                Lesson {currentLesson + 1} of {lessons.length}: {currentLessonContent?.title}
              </p>
            </div>
            <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
              <i className="fas fa-times" />
            </Button>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Lesson Progress</span>
              <span className="text-sm text-pink-400">{Math.round(lessonProgress)}%</span>
            </div>
            <Progress value={lessonProgress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLesson}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mb-4 ${
                  currentLessonContent?.type === 'education' ? 'bg-blue-500/20 text-blue-400' :
                  currentLessonContent?.type === 'exercise' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  <i className={`fas ${
                    currentLessonContent?.type === 'education' ? 'fa-book' :
                    currentLessonContent?.type === 'exercise' ? 'fa-dumbbell' :
                    'fa-heart'
                  } mr-2`} />
                  {currentLessonContent?.type === 'education' ? 'Learning' :
                   currentLessonContent?.type === 'exercise' ? 'Practice' : 'Reflection'}
                </div>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  {currentLessonContent?.content}
                </p>
              </div>

              {currentLessonContent?.type === 'reflection' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Your Reflection
                  </label>
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Take your time to reflect and write your thoughts..."
                    className="w-full h-32 p-4 bg-purple-900/30 border border-gray-600 rounded-xl resize-none focus:border-pink-500 focus:ring-pink-500/20"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8">
            <div className="flex space-x-2">
              {lessons.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index < currentLesson ? 'bg-green-500' :
                    index === currentLesson ? 'bg-pink-500' :
                    'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="glow-button px-6 py-2 rounded-full"
              >
                Save & Exit
              </Button>
              <Button
                onClick={handleNextLesson}
                disabled={lessonProgress < 100}
                className="glow-button px-6 py-2 rounded-full"
              >
                {currentLesson < lessons.length - 1 ? 'Next Lesson' : 'Complete Realm'}
                <i className="fas fa-arrow-right ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}