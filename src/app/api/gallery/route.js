import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const galleryCollection = db.collection('gallery');

        const images = await galleryCollection.find({}).sort({ createdAt: -1 }).toArray();
        
        return Response.json({
            images: images.map(img => ({
                ...img,
                _id: img._id.toString(),
            }))
        }, { status: 200 });
    } catch (error) {
        console.error('Gallery fetch error:', error);
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}