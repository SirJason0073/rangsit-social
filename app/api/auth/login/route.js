import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/utils/db';
import { signToken, setAuthCookie } from '@/utils/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        birthday: user.birthday,
        bio: user.bio,
        avatar: user.avatar,
        profile_completed: !!user.profile_completed,
        created_at: user.created_at
      }
    });
  } catch (err) {
    return NextResponse.json({ message: 'Login failed.' }, { status: 500 });
  }
}
