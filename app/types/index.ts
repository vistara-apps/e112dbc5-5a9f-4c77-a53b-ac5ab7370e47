export interface User {
  userId: string;
  farcasterId?: string;
  ethAddress?: string;
  createdAt: Date;
  credits: number;
}

export interface ProductImage {
  imageId: string;
  userId: string;
  imageUrl: string;
  uploadedAt: Date;
}

export interface AdVariant {
  variantId: string;
  imageId: string;
  platform: 'tiktok' | 'instagram';
  generatedImageUrl: string;
  generatedCopy: string;
  createdAt: Date;
}

export interface TestPost {
  postId: string;
  variantId: string;
  platform: 'tiktok' | 'instagram';
  postUrl?: string;
  postedAt: Date;
  status: 'pending' | 'success' | 'failed';
}

export interface GenerationRequest {
  imageFile: File;
  platforms: ('tiktok' | 'instagram')[];
  productName?: string;
  productDescription?: string;
}
