'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
  className?: string;
}

export function AppShell({ children, variant = 'default', className }: AppShellProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-accent" />
              <Zap className="w-4 h-4 text-primary absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Remixr</h1>
              <p className="text-sm text-muted-foreground">AI Ad Generation</p>
            </div>
          </motion.div>
          
          <ConnectWallet />
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        'max-w-7xl mx-auto px-6 py-8',
        variant === 'glass' && 'glass rounded-lg m-6'
      )}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>© 2024 Remixr. Turn product images into viral ads.</p>
        </div>
      </footer>
    </div>
  );
}
