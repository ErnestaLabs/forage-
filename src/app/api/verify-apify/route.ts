import { NextRequest, NextResponse } from 'next/server';
import { verifyApifyToken } from '@/lib/apify-auth';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let apifyToken;
    try {
      const body = JSON.parse(rawBody);
      apifyToken = body.apifyToken;
    } catch (err: any) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid request JSON', 
        message: err.message, 
        body: rawBody.substring(0, 100) 
      }, { status: 400 });
    }

    if (!apifyToken) {
      return NextResponse.json({ valid: false, error: 'Token is required' }, { status: 400 });
    }

    const result = await verifyApifyToken(apifyToken);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ 
      valid: false, 
      error: 'Verification failed', 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
