import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    
    const {
      name,
      phone,
      email,
      password,
      photo,
      category,
      specialties,
      battingStyle,
      bowlingStyle,
      age,
      role
    } = await request.json();

    // Check if user already exists
    const existingUser = await playersCollection.findOne({ 
      $or: [{ phone }, { email: email || '' }] 
    });
    
    if (existingUser) {
      return Response.json({ 
        message: 'User with this phone or email already exists' 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new player
    const result = await playersCollection.insertOne({
      name,
      phone,
      email: email || '',
      password: hashedPassword,
      photo: photo || '',
      category,
      specialties,
      battingStyle,
      bowlingStyle,
      age: parseInt(age),
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return Response.json({ 
      message: 'Player registered successfully', 
      playerId: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}