// app/api/player-details/[username]/route.js
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const playerDetailsCollection = db.collection('playerDetails');

    const { username } = await params;

    // Find player details by username
    const playerDetails = await playerDetailsCollection.findOne({ username });

    if (!playerDetails) {
      // Return default structure if no details exist
      return Response.json({
        matches: 0,
        runs: 0,
        wickets: 0,
        average: 0,
        strikeRate: 0,
        bestBatting: '0 (0)',
        economy: 0,
        bestBowling: '0/0',
        halfCenturies: 0,
        centuries: 0,
        thirties: 0,
        threeWickets: 0,
        fiveWickets: 0,
        maidens: 0,
        recentPerformance: []
      });
    }

    // Remove MongoDB _id field from response
    const { _id, ...cleanDetails } = playerDetails;
    return Response.json(cleanDetails);

  } catch (error) {
    console.error('Error fetching player details:', error);
    return Response.json({
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { db } = await connectToDatabase();
    const playerDetailsCollection = db.collection('playerDetails');

    const { username } = params;
    const updatedDetails = await request.json();

    // Update or insert player details
    const result = await playerDetailsCollection.updateOne(
      { username },
      {
        $set: {
          ...updatedDetails,
          username, // Ensure username is always set
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      message: 'Player details updated successfully',
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating player details:', error);
    return Response.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}