import { NextRequest, NextResponse } from 'next/server';
import { verifyApifyToken } from '@/lib/apify-auth';

export async function POST(request: NextRequest) {
  try {
    const { apifyToken } = await request.json();

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
