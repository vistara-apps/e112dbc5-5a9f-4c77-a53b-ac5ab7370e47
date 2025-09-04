import { NextRequest, NextResponse } from 'next/server';
import { generateAdVariations } from '@/app/lib/openai';
import { uploadImage } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const platforms = JSON.parse(formData.get('platforms') as string);
    const productName = formData.get('productName') as string || 'Product';
    const productDescription = formData.get('productDescription') as string || 'Amazing product';

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Upload the original image (in a real app, this would go to cloud storage)
    const imageUrl = await uploadImage(imageFile);

    // Generate ad variations
    const variations = await generateAdVariations(
      imageUrl,
      productName,
      productDescription,
      platforms
    );

    return NextResponse.json({ variations });
  } catch (error) {
    console.error('Error generating ad variations:', error);
    return NextResponse.json(
      { error: 'Failed to generate ad variations' },
      { status: 500 }
    );
  }
}
