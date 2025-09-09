'use server';
import { connectToDatabase } from "@/lib/mongodb";

// /api/players/by-id?id=123
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const player = await db.collection('players').findOne({ _id: new ObjectId(id) });

    if (!player) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
