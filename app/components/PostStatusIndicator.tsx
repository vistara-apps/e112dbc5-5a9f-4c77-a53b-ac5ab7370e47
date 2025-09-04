'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface PostStatusIndicatorProps {
  status: 'pending' | 'success' | 'failed';
  postUrl?: string;
  platform: string;
  variant?: 'default' | 'detailed';
  className?: string;
}

export function PostStatusIndicator({ 
  status, 
  postUrl, 
  platform, 
  variant = 'default',
  className 
}: PostStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          label: 'Posted Successfully'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          label: 'Posting...'
        };
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          label: 'Failed to Post'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (variant === 'detailed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center justify-between p-3 rounded-lg border',
          config.bg,
          config.border,
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className={cn('w-5 h-5', config.color)} />
          <div>
            <p className="font-medium capitalize">{platform}</p>
            <p className={cn('text-sm', config.color)}>{config.label}</p>
          </div>
        </div>
        
        {status === 'success' && postUrl && (
          <motion.a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
            whileHover={{ x: 2 }}
          >
            View
            <ExternalLink className="w-3 h-3" />
          </motion.a>
        )}
      </motion.div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className={cn('w-4 h-4', config.color)} />
      <span className="text-sm text-muted-foreground">{config.label}</span>
    </div>
  );
}
