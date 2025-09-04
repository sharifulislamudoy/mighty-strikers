import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    
    const { playerId } = await request.json();
    
    if (!playerId) {
      return Response.json({ message: 'Player ID is required' }, { status: 400 });
    }
    
    // Delete the player from database
    const result = await playersCollection.deleteOne({
      _id: new ObjectId(playerId)
    });
    
    if (result.deletedCount === 0) {
      return Response.json({ message: 'Player not found' }, { status: 404 });
    }
    
    return Response.json({ 
      message: 'Player deleted successfully'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting player:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}