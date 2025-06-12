import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { audioManager } from '@/lib/audio';
import { authService } from '@/lib/supabase';
import { UserState } from '@/types';
import Logo from '@/components/logo';

export default function Navbar() {
  const [location] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState<UserState>({ isAuthenticated: false });

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser({
        ...currentUser,
        isAuthenticated: true,
      });
    }
  }, []);

  const handleMusicToggle = () => {
    const playing = audioManager.toggleMusic();
    setIsPlaying(playing);
    audioManager.playUISound(playing ? 880 : 440, 150);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setUser({ isAuthenticated: false });
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo size="sm" className="group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-bold gradient-text">Inner Flame</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-gray-300 hover:text-pink-400 transition-colors ${
                location === '/' ? 'text-pink-400' : ''
              }`}
            >
              Home
            </Link>
            
            {user.isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-gray-300 hover:text-pink-400 transition-colors ${
                    location === '/dashboard' ? 'text-pink-400' : ''
                  }`}
                >
                  Journey
                </Link>
                <span className="text-gray-400 text-sm">Welcome, {user.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-pink-400"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link 
                href="/auth" 
                className={`text-gray-300 hover:text-pink-400 transition-colors ${
                  location === '/auth' ? 'text-pink-400' : ''
                }`}
              >
                Sign In
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMusicToggle}
              className="glow-button p-2 rounded-full"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'} text-sm`} />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMusicToggle}
              className="glow-button p-2 rounded-full"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'} text-sm`} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
