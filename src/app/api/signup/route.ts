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

    // Simplified: Return success with credit and Apify link
    // No API key needed - users connect via Apify MCP actor
    return NextResponse.json({
      success: true,
      message: '$5 Forage credit loaded. Connect via the Apify actor: https://apify.com/ernesta_labs/forage',
      isNewUser: true,
      userId: 'user_' + crypto.randomBytes(8).toString('hex'),
      credits: 5.00,
      apiKey: '', // Not needed for Apify MCP connection
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
