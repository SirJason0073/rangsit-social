import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/utils/auth';
import { query, toJSONSafe } from '@/utils/db';

export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });

    const [likes, comments, follows] = await Promise.all([
      query(
        `SELECT l.id AS activity_id, 'like' AS type, l.created_at,
          actor.id AS actor_id, actor.first_name, actor.last_name, actor.username, actor.avatar,
          p.id AS post_id, LEFT(p.content, 140) AS post_content
        FROM likes l
        JOIN posts p ON p.id = l.post_id
        JOIN users actor ON actor.id = l.user_id
        WHERE p.user_id = ? AND l.user_id <> ?
        ORDER BY l.created_at DESC LIMIT 50`,
        [user.id, user.id]
      ),
      query(
        `SELECT c.id AS activity_id, 'comment' AS type, c.created_at,
          actor.id AS actor_id, actor.first_name, actor.last_name, actor.username, actor.avatar,
          p.id AS post_id, LEFT(p.content, 140) AS post_content, LEFT(c.content, 140) AS comment_content
        FROM comments c
        JOIN posts p ON p.id = c.post_id
        JOIN users actor ON actor.id = c.user_id
        WHERE p.user_id = ? AND c.user_id <> ?
        ORDER BY c.created_at DESC LIMIT 50`,
        [user.id, user.id]
      ),
      query(
        `SELECT f.id AS activity_id, 'follow' AS type, f.created_at,
          actor.id AS actor_id, actor.first_name, actor.last_name, actor.username, actor.avatar,
          NULL AS post_id, NULL AS post_content
        FROM follows f
        JOIN users actor ON actor.id = f.follower_id
        WHERE f.following_id = ? AND f.follower_id <> ?
        ORDER BY f.created_at DESC LIMIT 50`,
        [user.id, user.id]
      )
    ]);

    const notifications = [...likes, ...comments, ...follows]
      .map((item) => ({ ...item, id: `${item.type}-${item.activity_id}` }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 100);

    return NextResponse.json({ notifications: toJSONSafe(notifications) });
  } catch (error) {
    console.error('[api/notifications] GET failed', error);
    return NextResponse.json({ message: 'Failed to load notifications.' }, { status: 500 });
  }
}
