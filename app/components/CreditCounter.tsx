'use client';

import { motion } from 'framer-motion';
import { Coins, Plus } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface CreditCounterProps {
  credits: number;
  onBuyCredits?: () => void;
  variant?: 'display' | 'interactive';
  className?: string;
}

export function CreditCounter({ 
  credits, 
  onBuyCredits, 
  variant = 'display', 
  className 
}: CreditCounterProps) {
  if (variant === 'interactive') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-border">
          <Coins className="w-4 h-4 text-accent" />
          <span className="font-medium">{credits}</span>
          <span className="text-sm text-muted-foreground">credits</span>
        </div>
        
        {onBuyCredits && (
          <motion.button
            onClick={onBuyCredits}
            className="flex items-center gap-2 bg-accent text-background px-3 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Buy More
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-2 bg-surface rounded-lg px-4 py-2 border border-border',
        className
      )}
    >
      <Coins className="w-5 h-5 text-accent" />
      <span className="text-lg font-medium">{credits}</span>
      <span className="text-muted-foreground">credits</span>
    </motion.div>
  );
}
