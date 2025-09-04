'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { AppShell } from './components/AppShell';
import { ImageUploader } from './components/ImageUploader';
import { PlatformSelector } from './components/PlatformSelector';
import { AdCreativeCard } from './components/AdCreativeCard';
import { CreditCounter } from './components/CreditCounter';
import { PostStatusIndicator } from './components/PostStatusIndicator';
import { generateId } from './lib/utils';
import { postAdVariations } from './lib/farcaster';
import { GenerationRequest, AdVariant, TestPost } from './types';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'configure' | 'generating' | 'results'>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'instagram']);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<(AdVariant & { postStatus?: TestPost })[]>([]);
  const [userCredits, setUserCredits] = useState(50);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setCurrentStep('configure');
  };

  const handleGenerate = async () => {
    if (!selectedImage || selectedPlatforms.length === 0) return;

    if (userCredits < 5) {
      alert('Insufficient credits! You need 5 credits to generate ad variations.');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');

    try {
      // Create form data for the API
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('platforms', JSON.stringify(selectedPlatforms));
      formData.append('productName', productName || 'Product');
      formData.append('productDescription', productDescription || 'Amazing product');

      // Generate ad variations
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate variations');
      }

      const { variations } = await response.json();

      // Convert to our format and add IDs
      const formattedVariations = variations.map((v: any) => ({
        variantId: generateId(),
        imageId: generateId(),
        platform: v.platform,
        generatedImageUrl: v.generatedImageUrl,
        generatedCopy: v.generatedCopy,
        createdAt: new Date(),
      }));

      // Post to Farcaster (simulated)
      const postResults = await postAdVariations(formattedVariations);
      
      // Combine with post status
      const finalResults = formattedVariations.map((variant: AdVariant, index: number) => ({
        ...variant,
        postStatus: {
          postId: generateId(),
          variantId: variant.variantId,
          platform: variant.platform,
          postUrl: postResults[index]?.postUrl,
          postedAt: new Date(),
          status: postResults[index]?.status || 'failed',
        } as TestPost
      }));

      setResults(finalResults);
      setUserCredits(prev => prev - 5);
      setCurrentStep('results');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate ad variations. Please try again.');
      setCurrentStep('configure');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFlow = () => {
    setCurrentStep('upload');
    setSelectedImage(null);
    setSelectedPlatforms(['tiktok', 'instagram']);
    setProductName('');
    setProductDescription('');
    setResults([]);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-accent" />
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-3">
            Turn Products Into Viral Ads
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload one product image and get 3-5 AI-generated ad variations automatically posted to test accounts
          </p>
        </motion.div>

        {/* Credits Display */}
        <div className="flex justify-center mb-8">
          <CreditCounter 
            credits={userCredits} 
            variant="interactive"
            onBuyCredits={() => alert('Credit purchase coming soon!')}
          />
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-surface rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6 text-center">Upload Product Image</h2>
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
            </motion.div>
          )}

          {currentStep === 'configure' && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-surface rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-bold mb-6">Configure Your Ads</h2>
                
                <div className="space-y-6">
                  {/* Product Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name</label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                        className="w-full p-3 bg-background border border-border rounded-lg focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <input
                        type="text"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Brief product description"
                        className="w-full p-3 bg-background border border-border rounded-lg focus:border-accent outline-none"
                      />
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <PlatformSelector
                    onSelectionChange={setSelectedPlatforms}
                    variant="toggle"
                  />

                  {/* Preview */}
                  {selectedImage && (
                    <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                      <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Selected product"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{selectedImage.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <motion.button
                    onClick={handleGenerate}
                    disabled={!selectedImage || selectedPlatforms.length === 0 || userCredits < 5}
                    className="w-full bg-accent text-background py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate & Post Ads
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-20"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-4 border-accent/20 border-t-accent rounded-full"
                />
                <div className="absolute inset-4 bg-accent/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">Creating Your Viral Ads</h2>
              <p className="text-muted-foreground mb-6">
                AI is generating {selectedPlatforms.length * 3} unique ad variations and posting them to test accounts...
              </p>
              <div className="max-w-md mx-auto space-y-2">
                {['Analyzing product image', 'Generating ad creatives', 'Creating platform-specific copy', 'Posting to test accounts'].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.5 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    {step}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-3">Your Ads Are Live! 🚀</h2>
                <p className="text-muted-foreground">
                  Generated {results.length} ad variations and posted them to test accounts
                </p>
              </div>

              {/* Post Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['success', 'pending', 'failed'].map((status) => {
                  const count = results.filter(r => r.postStatus?.status === status).length;
                  return (
                    <div key={status} className="bg-surface rounded-lg p-4 border border-border text-center">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground capitalize">{status}</div>
                    </div>
                  );
                })}
              </div>

              {/* Ad Variations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((variant) => (
                  <AdCreativeCard
                    key={variant.variantId}
                    variant={variant}
                    variant="withActionButtons"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={resetFlow}
                  className="px-6 py-3 bg-surface border border-border rounded-lg font-medium hover:bg-background transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create More Ads
                </motion.button>
                <motion.button
                  onClick={() => alert('Analytics dashboard coming soon!')}
                  className="px-6 py-3 bg-accent text-background rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Analytics
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
