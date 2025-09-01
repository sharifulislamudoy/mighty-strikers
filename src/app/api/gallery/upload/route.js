// src/app/api/gallery/upload/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const username = formData.get('username');
    const name = formData.get('name');
    const category = formData.get('category');
    const title = formData.get('title');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload to Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'react_unsigned');
    cloudinaryFormData.append('cloud_name', 'dohhfubsa');

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/dohhfubsa/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const cloudinaryData = await cloudinaryResponse.json();

    // Save to MongoDB
    const { db } = await connectToDatabase();
    const galleryCollection = db.collection('gallery');

    // Check if image already exists
    const existingImage = await galleryCollection.findOne({
      username,
      image: cloudinaryData.secure_url
    });

    if (existingImage) {
      return NextResponse.json(
        { error: 'Image already exists in gallery' },
        { status: 400 }
      );
    }

    // Add to gallery
    const result = await galleryCollection.insertOne({
      username,
      name,
      image: cloudinaryData.secure_url,
      category,
      title: title || 'Untitled',
      likes: 0,
      likedBy: [],
      createdAt: new Date()
    });

    return NextResponse.json({
      message: 'Image uploaded successfully',
      imageUrl: cloudinaryData.secure_url,
      galleryId: result.insertedId
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}