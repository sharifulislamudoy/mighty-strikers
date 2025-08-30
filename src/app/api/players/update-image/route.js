import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    
    const { username, image } = await request.json();

    // Update player's image
    const result = await playersCollection.updateOne(
      { username },
      { $set: { image, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ 
        message: 'Player not found' 
      }, { status: 404 });
    }

    return Response.json({ 
      message: 'Player image updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Player image update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}