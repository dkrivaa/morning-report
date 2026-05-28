import { NextRequest, NextResponse } from 'next/server';
import { signToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const APP_PASSWORD = process.env.APP_PASSWORD;
  if (!APP_PASSWORD) throw new Error("Missing env variable: APP_PASSWORD");

  if (password !== APP_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const token = await signToken();
    const res = NextResponse.json({ ok: true });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    });

    return res;
  } catch (e) {
    console.error('signToken failed:', e);
    return NextResponse.json({ error: 'Token signing failed' }, { status: 500 });
  }
}