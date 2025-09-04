import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
    try {
        const { imageId } = await req.json();

        if (!imageId) {
            return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const galleryCollection = db.collection('gallery');

        // Simply increment the like count without checking for user
        const result = await galleryCollection.updateOne(
            { _id: new ObjectId(imageId) },
            { $inc: { likes: 1 } }
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