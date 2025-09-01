// app/api/players/[username]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request, { params }) {
    try {
        const { username } = params;
        const { db } = await connectToDatabase();
        const playersCollection = db.collection('players');

        const player = await playersCollection.findOne({ username });

        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        // Convert ObjectId to string
        const playerData = {
            ...player,
            _id: player._id.toString(),
            likes: player.likes || 0
        };

        return NextResponse.json(playerData);
    } catch (error) {
        console.error('Player fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const { username } = params;
        const { liked } = await request.json();
        
        const { db } = await connectToDatabase();
        const playersCollection = db.collection('players');

        // Find the player
        const player = await playersCollection.findOne({ username });
        
        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        // Update likes count
        const newLikes = liked ? (player.likes || 0) + 1 : Math.max(0, (player.likes || 0) - 1);
        
        await playersCollection.updateOne(
            { username },
            { $set: { likes: newLikes } }
        );

        return NextResponse.json({ 
            message: 'Like updated successfully', 
            likes: newLikes 
        });
    } catch (error) {
        console.error('Like update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}