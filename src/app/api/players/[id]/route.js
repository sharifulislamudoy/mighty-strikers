// /api/players/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToDatabase();

    const player = await db.collection('players').findOne({
      _id: new ObjectId(id)
    });

    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch player', error: error.message },
      { status: 500 }
    );
  }
}