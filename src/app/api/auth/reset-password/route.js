import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const playersCollection = db.collection('players');
    const verificationCodesCollection = db.collection('verificationCodes');
    
    const { email, code, newPassword } = await request.json();

    // Verify the code again
    const verification = await verificationCodesCollection.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return Response.json({ message: 'Invalid or expired verification code' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await playersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    // Delete the used verification code
    await verificationCodesCollection.deleteOne({ email, code });

    return Response.json({ 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}