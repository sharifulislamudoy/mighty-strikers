import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const matchData = await request.json();
    const { db } = await connectToDatabase();

    // Insert the new match
    const result = await db.collection('matches').insertOne({
      ...matchData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      _id: result.insertedId,
      ...matchData
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create match', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const matches = await db.collection('matches').find({}).toArray();
    
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch matches', error: error.message },
      { status: 500 }
    );
  }
}

// Add other methods as needed
export async function PUT() {
  return NextResponse.json({ message: 'Method not implemented' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Method not implemented' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: 'Method not implemented' }, { status: 405 });
}