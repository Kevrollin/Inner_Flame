import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MentalRealm } from '@/types';
import { motion } from 'framer-motion';

interface RealmCardProps {
  realm: MentalRealm;
  onEnter?: (realm: MentalRealm) => void;
  className?: string;
}

export default function RealmCard({ realm, onEnter, className = '' }: RealmCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEnter = () => {
    if (realm.isUnlocked && onEnter) {
      onEnter(realm);
    }
  };

  const getProgressColor = () => {
    if (realm.progress >= 80) return 'from-green-400 to-emerald-500';
    if (realm.progress >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-pink-400 to-rose-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`realm-card p-6 rounded-2xl relative overflow-hidden cursor-pointer ${
        !realm.isUnlocked ? 'opacity-40' : ''
      } ${className}`}
      onClick={handleEnter}
    >
      {/* Background Image */}
      {realm.bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${realm.bgImage})` }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-2xl font-bold ${realm.isUnlocked ? realm.color : 'text-gray-500'}`}>
            {realm.name}
          </h3>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            realm.isUnlocked 
              ? `bg-gradient-to-r ${getProgressColor()} bg-opacity-20` 
              : 'bg-gray-500/20'
          }`}>
            <i className={`fas ${realm.icon} ${realm.isUnlocked ? realm.color : 'text-gray-500'}`} />
          </div>
        </div>
        
        <p className={`mb-6 ${realm.isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
          {realm.description}
        </p>
        
        <div className="flex items-center justify-between">
          {realm.isUnlocked ? (
            <>
              <div className="flex-1 mr-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Progress</span>
                  <span className="text-sm font-semibold">{realm.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
                    style={{ width: `${realm.progress}%` }}
                  />
                </div>
              </div>
              <Button
                className={`glow-button px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  isHovered ? 'scale-105' : ''
                }`}
              >
                {realm.progress > 0 ? 'Continue' : 'Enter'}
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500">Locked</span>
              <Button
                disabled
                className="px-4 py-2 rounded-full text-sm bg-gray-600 text-gray-400 cursor-not-allowed"
              >
                <i className="fas fa-lock mr-2" />
                Locked
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Glow effect on hover */}
      {realm.isUnlocked && isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse" />
      )}
    </motion.div>
  );
}
