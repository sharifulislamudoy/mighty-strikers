import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
    try {
        const { username } = params;
        const { liked } = await request.json();
        
        const { db } = await connectToDatabase();
        
        // Find the player by username
        const player = await db.collection('players').findOne({ username });
        
        if (!player) {
            return NextResponse.json({ message: 'Player not found' }, { status: 404 });
        }
        
        // Update likes count
        const newLikes = liked ? (player.likes || 0) + 1 : Math.max(0, (player.likes || 0) - 1);
        
        // Update the player in the database
        await db.collection('players').updateOne(
            { _id: new ObjectId(player._id) },
            { $set: { likes: newLikes } }
        );
        
        return NextResponse.json({ 
            message: 'Like updated successfully', 
            likes: newLikes 
        });
        
    } catch (error) {
        console.error('Error updating like:', error);
        return NextResponse.json(
            { message: 'Internal server error' }, 
            { status: 500 }
        );
    }
}