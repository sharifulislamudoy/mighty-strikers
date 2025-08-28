import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    
    const { phone, password } = await request.json();

    // Find user by phone
    const user = await playersCollection.findOne({ phone });
    
    if (!user) {
      return Response.json({ message: 'Invalid phone number or password' }, { status: 400 });
    }

    // Check password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return Response.json({ message: 'Invalid phone number or password' }, { status: 400 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({ 
      message: 'Login successful', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}