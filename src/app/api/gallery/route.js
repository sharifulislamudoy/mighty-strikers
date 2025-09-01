// src/app/api/gallery/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const galleryCollection = db.collection('gallery');

        const images = await galleryCollection.find({}).sort({ createdAt: -1 }).toArray();
        
        return NextResponse.json({
            images: images.map(img => ({
                ...img,
                _id: img._id.toString(),
                likes: img.likes || 0
            }))
        }, { status: 200 });
    } catch (error) {
        console.error('Gallery fetch error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}