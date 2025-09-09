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

    const newMatch = {
      _id: result.insertedId,
      ...matchData
    };

    return NextResponse.json(newMatch, { status: 201 });
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
    
    // Convert ObjectId to string for frontend
    const formattedMatches = matches.map(match => ({
      ...match,
      _id: match._id.toString(),
      selectedPlayersData: match.selectedPlayersData || []
    }));
    
    return NextResponse.json(formattedMatches, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch matches', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { matchId } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection('matches').deleteOne({
      _id: new ObjectId(matchId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Match deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete match', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const matchData = await request.json();
    const { db } = await connectToDatabase();

    const { matchId, ...updateData } = matchData;

    const result = await db.collection('matches').updateOne(
      { _id: new ObjectId(matchId) },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Match not found' },
        { status: 404 }
      );
    }

    // Return updated match
    const updatedMatch = await db.collection('matches').findOne({ _id: new ObjectId(matchId) });
    const formattedMatch = {
      ...updatedMatch,
      _id: updatedMatch._id.toString()
    };

    return NextResponse.json(formattedMatch, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update match', error: error.message },
      { status: 500 }
    );
  }
}