import { useEffect } from 'react';
import { useLocation } from 'wouter';
import AuthForm from '@/components/auth-form';
import Particles from '@/components/particles';
import { authService } from '@/lib/supabase';

export default function Auth() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const user = authService.getUser();
    if (user) {
      setLocation('/dashboard');
    }
  }, [setLocation]);

  const handleAuthSuccess = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20">
      {/* Background Particles */}
      <Particles config={{ count: 30, speed: 20 }} />
      
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
}
