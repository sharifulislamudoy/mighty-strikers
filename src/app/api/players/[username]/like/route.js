import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request, { params }) {
  try {
    const { username } =await params;
    const { liked } = await request.json();
    
    console.log('API Called with username:', username);
    console.log('Like status:', liked);
    
    if (typeof liked !== 'boolean') {
      return Response.json({ message: 'Invalid like status' }, { status: 400 });
    }
    
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    
    // Find the player by username
    const player = await playersCollection.findOne({ username });
    console.log('Found player:', player);
    
    if (!player) {
      return Response.json({ message: 'Player not found' }, { status: 404 });
    }
    
    // Calculate new like count
    const currentLikes = player.likes || 0;
    const newLikeCount = liked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    
    // Update the player
    const result = await playersCollection.updateOne(
      { username },
      { $set: { likes: newLikeCount } }
    );
    
    console.log('Update result:', result);
    
    if (result.modifiedCount === 0) {
      return Response.json({ message: 'Failed to update like count' }, { status: 500 });
    }
    
    return Response.json({ 
      message: 'Like updated successfully',
      likes: newLikeCount 
    });
    
  } catch (error) {
    console.error('Error updating like:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}