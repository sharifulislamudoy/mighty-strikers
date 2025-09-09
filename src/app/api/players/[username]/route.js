'use server';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';  // এটা add করুন যদি না থাকে

export async function GET(request, { params }) {
    try {
        const { username } = params;  // এখন এটা slug হিসেবে কাজ করবে (ID বা username)
        const { db } = await connectToDatabase();
        const playersCollection = db.collection('players');

        let player;

        // প্রথমে চেক করুন যে username আসলে ObjectId কিনা
        try {
            const objectId = new ObjectId(username);
            player = await playersCollection.findOne({ _id: objectId });
        } catch (idError) {
            // যদি valid ObjectId না হয়, তাহলে username হিসেবে খুঁজুন (আগের logic)
            player = await playersCollection.findOne({ username });
        }

        if (!player) {
            return NextResponse.json({ error: 'Player not found' }, { status: 404 });
        }

        // Convert ObjectId to string (আগের মতো)
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
    // এটা unchanged—আগের মতো username দিয়ে like update
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