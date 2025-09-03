import { connectToDatabase } from "@/lib/mongodb";
import crypto from 'crypto';
import { sendResetCode } from '@/lib/email';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    const verificationCodesCollection = db.collection('verificationCodes');
    
    const { email } = await request.json();

    // Find user by email
    const user = await playersCollection.findOne({ email });
    
    if (!user) {
      return Response.json({ message: 'No account found with this email' }, { status: 404 });
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    
    // Store code in database with expiration (10 minutes)
    await verificationCodesCollection.insertOne({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date()
    });

    // Send email with code
    await sendResetCode(email, code);

    return Response.json({ 
      message: 'Verification code sent to your email' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}