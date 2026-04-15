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
      return NextResponse.json({ error: 'Invalid Apify token. Please check your token in Apify Console.' }, { status: 401 });
    }

    // 3. Check for duplicates
    const { isDuplicate, record } = await checkDuplicate(auth.userId, email);
    
    if (isDuplicate && record) {
      return NextResponse.json({
        success: true,
        message: `Welcome back, ${auth.username}! You have $${(record.credits - record.creditsUsed).toFixed(2)} remaining credit.`,
        isNewUser: false,
        userId: record.apifyUserId,
        credits: record.credits - record.creditsUsed,
        apiKey: '', // No longer used
      });
    }

    // 4. Create new user record
    const newRecord: UserRecord = {
      apifyUserId: auth.userId,
      apifyUsername: auth.username,
      email: email.toLowerCase(),
      useCase: useCase,
      credits: 5.00,
      creditsUsed: 0,
      createdAt: new Date().toISOString(),
      source: 'landing-page'
    };

    await setUserRecord(newRecord);

    return NextResponse.json({
      success: true,
      message: `$5 Forage credit loaded. Connect via the Apify actor: https://apify.com/ernesta_labs/forage`,
      isNewUser: true,
      userId: newRecord.apifyUserId,
      credits: 5.00,
      apiKey: '',
    });

  } catch (error) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : String(error);
    const timestamp = new Date().toISOString();
    return NextResponse.json(
      { 
        error: message.includes('not configured') ? `Server configuration error: APIFY_TOKEN missing [${timestamp}]` : 
               message.includes('Apify API error') ? `${message} [${timestamp}]` : `Failed to process signup. Please try again. [${timestamp}]`,
        debug: process.env.NODE_ENV === 'development' ? message : undefined
      },
      { status: 500 }
    );
  }
}
