import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    
    const { playerId } = await request.json();
    
    if (!playerId) {
      return Response.json({ message: 'Player ID is required' }, { status: 400 });
    }
    
    // Update player status to approved
    const result = await playersCollection.updateOne(
      { _id: new ObjectId(playerId) },
      { $set: { status: 'approved', updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return Response.json({ message: 'Player not found' }, { status: 404 });
    }
    
    return Response.json({ 
      message: 'Player approved successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error approving player:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}