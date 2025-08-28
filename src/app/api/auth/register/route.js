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
      category, // This contains the role data from the form (previously called category)
      specialties,
      battingStyle,
      bowlingStyle,
      age
    } = await request.json();

    // Generate username from name (convert to lowercase and replace spaces with hyphens)
    const baseUsername = name.toLowerCase().replace(/\s+/g, '-');
    let username = baseUsername;
    let counter = 1;

    // Check if user already exists with phone, email, or generated username
    const existingUser = await playersCollection.findOne({ 
      $or: [
        { phone }, 
        { email: email || '' }, 
        { username: baseUsername }
      ] 
    });
    
    if (existingUser) {
      // If username already exists, find a unique one
      if (existingUser.username === baseUsername) {
        while (true) {
          username = `${baseUsername}-${counter}`;
          const userWithSameUsername = await playersCollection.findOne({ username });
          
          if (!userWithSameUsername) {
            break;
          }
          counter++;
        }
      } else {
        // If phone or email already exists
        let conflictField = '';
        if (existingUser.phone === phone) conflictField = 'phone number';
        if (existingUser.email === email) conflictField = 'email';
        
        return Response.json({ 
          message: `User with this ${conflictField} already exists` 
        }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new player
    const result = await playersCollection.insertOne({
      name,
      username,
      phone,
      email: email || '',
      password: hashedPassword,
      photo: photo || '',
      category,
      specialties,
      battingStyle,
      bowlingStyle,
      age: parseInt(age),
      role: 'player', // Always set role to 'player'
      likes: 0, // Add likes field with initial value 0
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return Response.json({ 
      message: 'Player registered successfully', 
      playerId: result.insertedId,
      username: username
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}