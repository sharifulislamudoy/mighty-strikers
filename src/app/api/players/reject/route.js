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
    
    // Delete the player from database
    const result = await playersCollection.deleteOne({
      _id: new ObjectId(playerId),
      status: 'pending'
    });
    
    if (result.deletedCount === 0) {
      return Response.json({ message: 'Player not found or already processed' }, { status: 404 });
    }
    
    return Response.json({ 
      message: 'Player rejected successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error rejecting player:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}