import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

export async function POST(req) {
    try {
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