'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  variant?: 'dragDrop' | 'button';
  className?: string;
}

export function ImageUploader({ onImageSelect, variant = 'dragDrop', className }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const clearSelection = () => {
    setSelectedImage(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  if (variant === 'button') {
    return (
      <div className={cn('space-y-4', className)}>
        <input {...getInputProps()} />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => document.querySelector('input[type="file"]')?.click()}
          className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Upload className="w-5 h-5" />
          Choose Product Image
        </motion.button>
        
        <AnimatePresence>
          {preview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative rounded-lg overflow-hidden"
            >
              <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              <button
                onClick={clearSelection}
                className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <motion.div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive 
            ? 'border-accent bg-accent/5' 
            : 'border-border hover:border-accent/50',
          preview && 'border-accent bg-accent/5'
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="relative inline-block">
                <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-background border border-border rounded-full hover:bg-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedImage?.name}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-surface rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your image here' : 'Upload product image'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop or click to select
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
