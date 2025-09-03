import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { db } = await connectToDatabase();
    const verificationCodesCollection = db.collection('verificationCodes');
    
    const { email, code } = await request.json();

    // Find the verification code
    const verification = await verificationCodesCollection.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return Response.json({ message: 'Invalid or expired verification code' }, { status: 400 });
    }

    return Response.json({ 
      message: 'Code verified successfully',
      valid: true
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}