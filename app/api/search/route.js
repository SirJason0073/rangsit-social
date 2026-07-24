import { NextResponse } from 'next/server';
import { hasTable, query, toCountNumber, toJSONSafe } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

function pagination(searchParams) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(20, Math.max(1, Number(searchParams.get('limit')) || 8));
  return { page, limit, offset: (page - 1) * limit };
}

export async function GET(request) {
  try {
    const viewer = await getUserFromRequest();
    if (!viewer) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const searchTerm = (searchParams.get('q') || '').trim().slice(0, 60);
    const { page, limit, offset } = pagination(searchParams);
    if (searchTerm.length < 2) {
      return NextResponse.json({
        query: searchTerm,
        users: [],
        posts: [],
        pagination: { page, limit, userTotal: 0, postTotal: 0, hasMore: false }
      });
    }

    const pattern = `%${searchTerm}%`;
    const safeLimit = Number(limit);
    const safeOffset = Number(offset);
    const savedPostsAvailable = await hasTable('saved_posts');
    const savedSelect = savedPostsAvailable
      ? '(SELECT COUNT(*) FROM saved_posts WHERE post_id = posts.id AND user_id = ?) AS saved'
      : '0 AS saved';

    const [userTotals, postTotals, users, posts] = await Promise.all([
      query(
        `SELECT COUNT(*) AS count FROM users
         WHERE profile_completed = 1
           AND (first_name LIKE ? OR last_name LIKE ? OR username LIKE ? OR bio LIKE ?)`,
        [pattern, pattern, pattern, pattern]
      ),
      query('SELECT COUNT(*) AS count FROM posts WHERE content LIKE ?', [pattern]),
      query(
        `SELECT u.id, u.first_name, u.last_name, u.username, u.bio, u.avatar,
          EXISTS(
            SELECT 1 FROM follows f
            WHERE f.follower_id = ? AND f.following_id = u.id
          ) AS isFollowing
         FROM users u
         WHERE u.profile_completed = 1
           AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.username LIKE ? OR u.bio LIKE ?)
         ORDER BY
           CASE WHEN u.username = ? THEN 0 ELSE 1 END,
           u.first_name ASC, u.username ASC
         LIMIT ${safeLimit} OFFSET ${safeOffset}`,
        [viewer.id, pattern, pattern, pattern, pattern, searchTerm]
      ),
      query(
        `SELECT posts.id, posts.user_id, posts.content, posts.media_url, posts.media_type, posts.created_at, posts.updated_at,
          users.first_name, users.last_name, users.username, users.avatar AS author_avatar,
          (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
          (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count,
          (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ?) AS liked,
          ${savedSelect}
         FROM posts
         JOIN users ON users.id = posts.user_id
         WHERE posts.content LIKE ?
         ORDER BY posts.created_at DESC
         LIMIT ${safeLimit} OFFSET ${safeOffset}`,
        savedPostsAvailable ? [viewer.id, viewer.id, pattern] : [viewer.id, pattern]
      )
    ]);

    const userTotal = toCountNumber(userTotals[0]?.count);
    const postTotal = toCountNumber(postTotals[0]?.count);
    return NextResponse.json(toJSONSafe({
      query: searchTerm,
      users,
      posts,
      pagination: {
        page,
        limit,
        userTotal,
        postTotal,
        hasMore: offset + limit < Math.max(userTotal, postTotal)
      }
    }));
  } catch (error) {
    console.error('[api/search] GET failed', error);
    return NextResponse.json({ message: 'Search is temporarily unavailable.' }, { status: 500 });
  }
}
