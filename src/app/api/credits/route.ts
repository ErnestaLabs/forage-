import { NextRequest, NextResponse } from 'next/server';
import { verifyApifyToken, getUserRecord } from '@/lib/apify-auth';

export async function POST(request: NextRequest) {
  try {
    const { apifyToken } = await request.json();

    if (!apifyToken) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const auth = await verifyApifyToken(apifyToken);
    if (!auth.valid || !auth.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const record = await getUserRecord(auth.userId);
    if (!record) {
      return NextResponse.json({ error: 'Account not found. Please sign up first.' }, { status: 404 });
    }

    return NextResponse.json({
      credits: record.credits,
      creditsUsed: record.creditsUsed,
      remaining: record.credits - record.creditsUsed
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}
