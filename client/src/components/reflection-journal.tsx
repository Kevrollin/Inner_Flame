import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReflectionEntry } from '@/types';
import { authService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ReflectionJournalProps {
  realmId?: string;
  className?: string;
}

export default function ReflectionJournal({ realmId, className = '' }: ReflectionJournalProps) {
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [newReflection, setNewReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const user = authService.getUser();

  useEffect(() => {
    if (user) {
      loadReflections();
    }
  }, [user]);

  const loadReflections = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/reflections/${user.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setReflections(data.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt),
        })));
      }
    } catch (error) {
      console.error('Failed to load reflections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReflection.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          realmId,
          content: newReflection.trim(),
        }),
      });

      if (response.ok) {
        const reflection = await response.json();
        setReflections(prev => [
          {
            ...reflection,
            createdAt: new Date(reflection.createdAt),
          },
          ...prev,
        ]);
        setNewReflection('');
        toast({
          title: 'Reflection Saved',
          description: 'Your insight has been added to your journey.',
        });
      } else {
        throw new Error('Failed to save reflection');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your reflection. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRealmName = (realmId?: string) => {
    const realmNames: Record<string, string> = {
      fear: 'Fear Realm',
      doubt: 'Doubt Realm',
      anxiety: 'Anxiety Realm',
      'self-worth': 'Self-Worth Realm',
      forgiveness: 'Forgiveness Realm',
      wisdom: 'Wisdom Realm',
    };
    return realmId ? realmNames[realmId] || realmId : 'General';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-400">Please sign in to access your reflection journal.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold gradient-text mb-8 text-center"
      >
        Your Reflection Journal
      </motion.h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add New Reflection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-cyan-400 flex items-center">
                <i className="fas fa-feather mr-2" />
                Add New Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={newReflection}
                  onChange={(e) => setNewReflection(e.target.value)}
                  placeholder="What insights have you discovered today? How are you feeling about your journey?"
                  className="min-h-32 bg-purple-900/50 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400/20 resize-none"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !newReflection.trim()}
                  className="glow-button px-6 py-2 rounded-full"
                >
                  {isSubmitting ? 'Saving...' : 'Save Reflection'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Reflections */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-pink-400 flex items-center">
                <i className="fas fa-book-open mr-2" />
                Recent Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-purple-900/30 p-4 rounded-xl animate-pulse">
                      <div className="h-4 bg-gray-600 rounded mb-2" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : reflections.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {reflections.slice(0, 10).map((reflection, index) => (
                      <motion.div
                        key={reflection.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-purple-900/30 p-4 rounded-xl border border-gray-700/50 hover:border-pink-500/30 transition-colors"
                      >
                        <p className="text-gray-300 text-sm mb-2 line-clamp-3">
                          "{reflection.content}"
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{getRealmName(reflection.realmId)}</span>
                          <span>{formatDate(reflection.createdAt)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-seedling text-4xl text-gray-500 mb-4" />
                  <p className="text-gray-400">
                    Your reflection journey begins here. Share your first insight!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
