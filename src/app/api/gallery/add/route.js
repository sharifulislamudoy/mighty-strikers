import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request) {
    try {
        const { db } = await connectToDatabase();
        const galleryCollection = db.collection('gallery');

        const { username, name, image } = await request.json();

        // Check if image already exists for this user
        const existingImage = await galleryCollection.findOne({
            username,
            image
        });

        if (existingImage) {
            return Response.json({
                message: 'Image already exists in gallery'
            }, { status: 400 });
        }

        // Add to gallery
        const result = await galleryCollection.insertOne({
            username,
            name,
            image,
            category: 'profile-photo',
            title: 'Profile',
            likes: 0,
            createdAt: new Date()
        });

        return Response.json({
            message: 'Image added to gallery successfully',
            galleryId: result.insertedId
        }, { status: 201 });
    } catch (error) {
        console.error('Gallery addition error:', error);
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}