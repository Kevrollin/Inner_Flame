import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, error } = isLogin 
        ? await authService.signIn(formData.email, formData.password)
        : await authService.signUp(formData.email, formData.password, formData.username);

      if (error) {
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (user) {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: `Welcome to Inner Flame, ${user.username}`,
        });
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const quotes = [
    "Every flame starts small.",
    "Doubt is just a shadow.",
    "Your inner light can overcome any darkness.",
    "Growth begins with self-awareness.",
    "The journey inward is the most important one.",
  ];

  const currentQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="glass-morphism border-2 border-pink-500/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-cyan-400 animate-glow mb-4 flex items-center justify-center">
            <i className="fas fa-fire text-white text-2xl" />
          </div>
          <CardTitle className="text-3xl font-bold gradient-text mb-2">
            {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
          </CardTitle>
          <p className="text-gray-400 italic">"{currentQuote}"</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-purple-900/50 border-gray-600 focus:border-pink-500 focus:ring-pink-500/20"
                  placeholder="Your username"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="bg-purple-900/50 border-gray-600 focus:border-pink-500 focus:ring-pink-500/20"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="bg-purple-900/50 border-gray-600 focus:border-pink-500 focus:ring-pink-500/20"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full glow-button py-3 rounded-lg font-semibold text-lg"
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In to Your Journey' : 'Create Your Flame'}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <Button
                variant="link"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Forgot your flame?
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 mb-4">
              {isLogin ? 'New to Inner Flame?' : 'Already have an account?'}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="glow-button px-6 py-2 rounded-full"
            >
              {isLogin ? 'Create Account' : 'Sign In Instead'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
