import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request) {
    try {
        const { db } = await connectToDatabase();
        const playersCollection = db.collection('players');

        const { username, age } = await request.json();

        // Validate age
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 15 || ageNum > 50) {
            return Response.json({
                message: 'Invalid age. Must be between 15 and 50.'
            }, { status: 400 });
        }

        // Update player's age
        const result = await playersCollection.updateOne(
            { username },
            { $set: { age: ageNum, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return Response.json({
                message: 'Player not found'
            }, { status: 404 });
        }

        return Response.json({
            message: 'Player age updated successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('Player age update error:', error);
        return Response.json({ message: 'Internal server error' }, { status: 500 });
    }
}