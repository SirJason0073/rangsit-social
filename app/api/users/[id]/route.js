import { NextResponse } from 'next/server';
import { hasTable, query, toCountNumber, toJSONSafe } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';

function getPagination(searchParams, defaultLimit = 5, maxLimit = 20) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(searchParams.get('limit')) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export async function GET(req, { params }) {
  try {
    const user = await getUserFromRequest();
    const userId = user?.id || 0;
    const { searchParams } = new URL(req.url);
    const { page, limit, offset } = getPagination(searchParams);
    const includePosts = searchParams.get('includePosts') !== 'false';

    const [users, savedPostsAvailable] = await Promise.all([
      query(
        `SELECT u.id, u.email, u.first_name, u.last_name, u.username, u.birthday, u.bio, u.avatar,
          u.profile_completed, u.created_at,
          (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS follower_count,
          (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
          EXISTS(
            SELECT 1 FROM follows
            WHERE follower_id = ? AND following_id = u.id
          ) AS is_following,
          (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count
         FROM users u
         WHERE u.id = ?`,
        [userId, params.id]
      ),
      includePosts ? hasTable('saved_posts') : Promise.resolve(false)
    ]);
    const profile = users[0];
    if (!profile) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const {
      follower_count: followerCount,
      following_count: followingCount,
      is_following: isFollowing,
      post_count: postCount,
      ...publicProfile
    } = profile;
    const totalPosts = toCountNumber(postCount);
    const savedSelect = savedPostsAvailable
      ? '(SELECT COUNT(*) FROM saved_posts WHERE post_id = posts.id AND user_id = ?) AS saved'
      : '0 AS saved';
    const safeLimit = Number(limit);
    const safeOffset = Number(offset);

    const posts = includePosts ? await query(
      `SELECT posts.id, posts.user_id, posts.content, posts.media_url, posts.media_type, posts.created_at, posts.updated_at,
        users.first_name, users.last_name, users.username, users.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ?) AS liked,
        ${savedSelect}
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = ?
      ORDER BY posts.created_at DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      savedPostsAvailable
        ? [userId, userId, params.id]
        : [userId, params.id]
    ) : [];

    return NextResponse.json(toJSONSafe({
      user: publicProfile,
      stats: {
        followers: toCountNumber(followerCount),
        following: toCountNumber(followingCount),
        isFollowing: Boolean(isFollowing)
      },
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        hasMore: offset + posts.length < totalPosts
      }
    }));
  } catch (err) {
    console.error('[api/users/[id]] GET failed', { id: params?.id, error: err });
    return NextResponse.json({ message: 'Failed to fetch user.' }, { status: 500 });
  }
}
