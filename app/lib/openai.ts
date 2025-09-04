import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateAdVariations(
  imageUrl: string,
  productName: string,
  productDescription: string,
  platforms: string[]
) {
  try {
    const variations = [];
    
    for (const platform of platforms) {
      // Generate platform-specific copy
      const copyResponse = await openai.chat.completions.create({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          {
            role: 'system',
            content: `You are an expert ${platform} ad copywriter. Create engaging, platform-specific ad copy that drives conversions.`,
          },
          {
            role: 'user',
            content: `Create 3 different ad copy variations for ${platform} for this product:
            
            Product: ${productName}
            Description: ${productDescription}
            
            Make each variation unique with different hooks, styles, and calls-to-action. Keep within platform best practices for length and tone.`,
          },
        ],
        max_tokens: 500,
      });

      const copyVariations = copyResponse.choices[0]?.message?.content?.split('\n\n') || [];
      
      // Generate visual variations using DALL-E
      for (let i = 0; i < 3; i++) {
        const imageResponse = await openai.images.generate({
          model: 'dall-e-3',
          prompt: `Create a ${platform} ad creative based on this product: ${productName}. ${productDescription}. Make it eye-catching, professional, and optimized for ${platform} with vibrant colors and modern design. Include product placement and lifestyle elements.`,
          n: 1,
          size: platform === 'tiktok' ? '1024x1792' : '1024x1024',
          quality: 'standard',
        });

        variations.push({
          platform,
          generatedImageUrl: imageResponse.data[0]?.url || '',
          generatedCopy: copyVariations[i] || copyVariations[0] || 'Check out this amazing product!',
        });
      }
    }

    return variations;
  } catch (error) {
    console.error('Error generating ad variations:', error);
    throw new Error('Failed to generate ad variations');
  }
}
