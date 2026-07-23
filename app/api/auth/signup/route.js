import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/utils/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return NextResponse.json({ message: 'Email already in use.' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await query(
      'INSERT INTO users (email, password, profile_completed, created_at) VALUES (?, ?, 0, NOW())',
      [email, hashed]
    );

    return NextResponse.json({ message: 'Account created. Please log in.' }, { status: 201 });
  } catch (err) {
    console.error('[api/auth/signup] POST failed', err);

    if (err?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'Email already in use.' }, { status: 409 });
    }

    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ message: err?.sqlMessage || err?.message || 'Signup failed.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Signup failed.' }, { status: 500 });
  }
}
