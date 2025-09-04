export async function postToFarcaster(text: string, imageUrl?: string) {
  try {
    const response = await fetch('/api/farcaster/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        imageUrl,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to post to Farcaster');
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting to Farcaster:', error);
    throw error;
  }
}

export async function postAdVariations(variants: any[]) {
  const results = [];
  
  for (const variant of variants) {
    try {
      const result = await postToFarcaster(
        `🚀 ${variant.platform.toUpperCase()} AD TEST\n\n${variant.generatedCopy}\n\n#RemixrTest #${variant.platform}`,
        variant.generatedImageUrl
      );
      
      results.push({
        ...variant,
        postUrl: result.cast?.hash ? `https://warpcast.com/${result.cast.hash}` : undefined,
        status: 'success',
      });
    } catch (error) {
      results.push({
        ...variant,
        status: 'failed',
        error: error.message,
      });
    }
  }
  
  return results;
}
