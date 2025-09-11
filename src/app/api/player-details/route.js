import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const playerDetailsCollection = db.collection('playerDetails');
    const playersCollection = db.collection('players');

    // Get all player details
    const allPlayerDetails = await playerDetailsCollection.find({}).toArray();
    
    // Get all players for additional info
    const allPlayers = await playersCollection.find({}).toArray();

    // Combine the data
    const enrichedStats = allPlayerDetails.map(detail => {
      const player = allPlayers.find(p => p.username === detail.username) || {};
      return {
        ...detail,
        name: player.name || detail.username,
        image: player.image || null,
        category: player.category || 'Unknown',
      };
    });

    // Remove MongoDB _id fields
    const cleanStats = enrichedStats.map(({ _id, ...rest }) => rest);

    return Response.json(cleanStats);

  } catch (error) {
    console.error('Error fetching all player stats:', error);
    return Response.json({
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}