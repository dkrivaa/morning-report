import { NextRequest, NextResponse } from 'next/server';
import { signToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  console.log('APP_PASSWORD set:', !!process.env.APP_PASSWORD);
  console.log('APP_PASSWORD length:', process.env.APP_PASSWORD?.length);
  console.log('password received length:', password?.length);
  console.log('match:', password === process.env.APP_PASSWORD);

  const APP_PASSWORD = process.env.APP_PASSWORD;
  if (!APP_PASSWORD) throw new Error("Missing env variable: APP_PASSWORD");

  if (password !== process.env.APP_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
}