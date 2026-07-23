import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/utils/auth';

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({ message: 'Logged out.' });
}
