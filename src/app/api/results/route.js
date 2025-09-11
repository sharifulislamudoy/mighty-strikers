// src/app/api/results/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const resultData = await request.json();
    const { db } = await connectToDatabase();

    // Insert into 'results' collection
    const insertResult = await db.collection('results').insertOne({
      ...resultData,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Result saved', id: insertResult.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to save result', error: error.message }, { status: 500 });
  }
}


export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const matches = await db.collection('results').find({}).toArray();
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch matches', error: error.message }, { status: 500 });
  }
}