import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Simplified: Always return success with credit and Apify link
    // No API calls, no storage needed
    return NextResponse.json({
      success: true,
      message: 'Your $5.00 credit is ready! Use it with the Apify actor at https://apify.com/ernesta_labs/forage',
      isNewUser: true,
      userId: 'user_' + crypto.randomBytes(8).toString('hex'),
      credits: 5.00,
      apiKey: 'forg_' + crypto.randomBytes(24).toString('hex'),
    });

  } catch (error) {
    console.error('Signup error:', error);
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { 
        error: 'Failed to process signup. Please try again.',
        details: isDev ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
