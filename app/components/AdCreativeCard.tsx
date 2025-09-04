'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import { AdVariant, TestPost } from '@/app/types';

interface AdCreativeCardProps {
  variant: AdVariant & { postStatus?: TestPost };
  variant?: 'default' | 'withActionButtons';
  className?: string;
}

export function AdCreativeCard({ 
  variant: adVariant, 
  variant = 'default', 
  className 
}: AdCreativeCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(adVariant.generatedCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformGradient = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'from-pink-500 to-black';
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-accent to-primary';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return '🎵';
      case 'instagram':
        return '📸';
      default:
        return '🚀';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-surface rounded-lg border border-border overflow-hidden card-shadow',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-sm',
              getPlatformGradient(adVariant.platform)
            )}>
              {getPlatformIcon(adVariant.platform)}
            </div>
            <div>
              <h3 className="font-medium capitalize">{adVariant.platform}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(adVariant.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {adVariant.postStatus && (
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                adVariant.postStatus.status === 'success' ? 'bg-green-500' :
                adVariant.postStatus.status === 'pending' ? 'bg-yellow-500' :
                'bg-red-500'
              )} />
              <span className="text-sm text-muted-foreground capitalize">
                {adVariant.postStatus.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        {adVariant.generatedImageUrl ? (
          <img 
            src={adVariant.generatedImageUrl} 
            alt="Generated ad creative"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Generating...</span>
          </div>
        )}
      </div>

      {/* Copy */}
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm leading-relaxed flex-1">
              {adVariant.generatedCopy}
            </p>
            {variant === 'withActionButtons' && (
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>

          {variant === 'withActionButtons' && adVariant.postStatus?.postUrl && (
            <motion.a
              href={adVariant.postStatus.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
              whileHover={{ x: 2 }}
            >
              View Live Post
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
