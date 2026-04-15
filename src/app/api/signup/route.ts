import { NextRequest, NextResponse } from 'next/server';
import { verifyApifyToken, checkDuplicate, setUserRecord, UserRecord } from '@/lib/apify-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, apifyToken, useCase } = await request.json();

    // 1. Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!apifyToken) {
      return NextResponse.json({ error: 'Apify token is required' }, { status: 400 });
    }
    const validUseCases = ['B2B Lead Gen', 'Competitor Intel', 'Trading / Prediction Markets', 'General Research', 'Other'];
    if (!useCase || !validUseCases.includes(useCase)) {
      return NextResponse.json({ error: 'Please select a valid use case' }, { status: 400 });
    }

    // 2. Verify Apify Token
    const auth = await verifyApifyToken(apifyToken);
    if (!auth.valid || !auth.userId || !auth.username) {
      return NextResponse.json({ error: auth.error || 'Invalid Apify token' }, { status: 401 });
    }

    // 3. Check for duplicates
    const { isDuplicate, record } = await checkDuplicate(auth.userId, email);
    
    if (isDuplicate && record) {
      return NextResponse.json({
        success: true,
        message: `Welcome back, ${auth.username}! Your account is active.`,
        isNewUser: false,
        userId: record.apifyUserId,
        credits: record.credits - (record.creditsUsed || 0),
        apiKey: '',
      });
    }

    // 4. Create new user record
    const newRecord: UserRecord = {
      apifyUserId: auth.userId,
      apifyUsername: auth.username,
      email: email.toLowerCase().trim(),
      useCase: useCase,
      credits: 5.00,
      creditsUsed: 0,
      createdAt: new Date().toISOString(),
      source: 'landing-page'
    };

    // If APIFY_TOKEN is missing, we can't save but we can mock success for the demo if needed? 
    // No, better to fail clearly.
    await setUserRecord(newRecord);

    return NextResponse.json({
      success: true,
      message: `$5 Forage credit loaded. Connect via the Apify actor: https://apify.com/ernesta_labs/forage`,
      isNewUser: true,
      userId: newRecord.apifyUserId,
      credits: 5.00,
      apiKey: '',
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Check if it's our configuration error
    if (error.message?.includes('APIFY_TOKEN')) {
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support or try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process signup. Please check your connection and try again.' },
      { status: 500 }
    );
  }
}
