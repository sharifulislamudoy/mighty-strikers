// src/app/api/gallery/like/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';
import { authOptions } from '../../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { imageId } = await req.json();
    
    if (!imageId) {
      return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const galleryCollection = db.collection('gallery');

    // Check if user already liked this image
    const image = await galleryCollection.findOne({ _id: new ObjectId(imageId) });
    
    if (image.likedBy && image.likedBy.includes(session.user.id)) {
      return NextResponse.json({ message: 'Already liked' }, { status: 400 });
    }

    // Update the image with like and add user to likedBy array
    const result = await galleryCollection.updateOne(
      { _id: new ObjectId(imageId) },
      { 
        $inc: { likes: 1 },
        $push: { likedBy: session.user.id }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image liked successfully' }, { status: 200 });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}