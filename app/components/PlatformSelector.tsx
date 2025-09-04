'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface Platform {
  id: 'tiktok' | 'instagram';
  name: string;
  icon: string;
  color: string;
}

const platforms: Platform[] = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-pink-500 to-black' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-purple-500 to-pink-500' },
];

interface PlatformSelectorProps {
  onSelectionChange: (platforms: string[]) => void;
  variant?: 'checkbox' | 'toggle';
  className?: string;
}

export function PlatformSelector({ 
  onSelectionChange, 
  variant = 'checkbox', 
  className 
}: PlatformSelectorProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'instagram']);

  const togglePlatform = (platformId: string) => {
    const newSelection = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    setSelectedPlatforms(newSelection);
    onSelectionChange(newSelection);
  };

  if (variant === 'toggle') {
    return (
      <div className={cn('space-y-3', className)}>
        <h3 className="text-lg font-medium">Target Platforms</h3>
        <div className="flex gap-3">
          {platforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            
            return (
              <motion.button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={cn(
                  'flex items-center gap-3 p-4 rounded-lg border transition-all',
                  isSelected 
                    ? 'border-accent bg-accent/10 text-accent' 
                    : 'border-border hover:border-accent/50'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white',
                  platform.color
                )}>
                  {platform.icon}
                </div>
                <span className="font-medium">{platform.name}</span>
                {isSelected && <Check className="w-4 h-4 ml-auto" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-lg font-medium">Target Platforms</h3>
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <motion.label
              key={platform.id}
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all',
                isSelected 
                  ? 'border-accent bg-accent/10' 
                  : 'border-border hover:border-accent/50'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => togglePlatform(platform.id)}
                className="sr-only"
              />
              
              <div className={cn(
                'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white',
                platform.color
              )}>
                {platform.icon}
              </div>
              
              <span className="font-medium flex-1">{platform.name}</span>
              
              <div className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                isSelected 
                  ? 'border-accent bg-accent' 
                  : 'border-muted'
              )}>
                {isSelected && <Check className="w-3 h-3 text-background" />}
              </div>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
}
