import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    
    const { username } = params;
    
    // Find player by username
    const player = await playersCollection.findOne({ username });
    
    if (!player) {
      return Response.json({ message: 'Player not found' }, { status: 404 });
    }
    
    // Remove sensitive data
    const { password, ...playerWithoutPassword } = player;
    
    return Response.json(playerWithoutPassword);
  } catch (error) {
    console.error('Error fetching player:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}