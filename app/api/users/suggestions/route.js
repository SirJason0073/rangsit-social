import { NextResponse } from 'next/server';
import { query, toJSONSafe } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

export async function GET(request) {
  try {
    const viewer = await getUserFromRequest();

    if (!viewer) {
      return NextResponse.json({ users: [] });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(24, Math.max(1, Number(searchParams.get('limit')) || 5));

    const users = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.username, u.bio, u.avatar,
        0 AS isFollowing,
        (
          SELECT COUNT(*)
          FROM follows audience
          WHERE audience.following_id = u.id
        ) AS followerCount
      FROM users u
      WHERE u.id != ?
        AND u.profile_completed = 1
        AND NOT EXISTS(
          SELECT 1
          FROM follows my_follows
          WHERE my_follows.follower_id = ? AND my_follows.following_id = u.id
        )
      ORDER BY followerCount DESC, u.created_at DESC
      LIMIT ${limit}`,
      [viewer.id, viewer.id]
    );

    return NextResponse.json(toJSONSafe({ users }));
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch suggestions.' }, { status: 500 });
  }
}
