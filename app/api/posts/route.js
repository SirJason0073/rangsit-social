import { NextResponse } from 'next/server';
import { hasTable, query, toCountNumber, toJSONSafe } from '@/utils/db';
import { getUserFromRequest } from '@/utils/auth';
import { MEDIA_TYPES, saveUpload } from '@/utils/upload';

function getPagination(searchParams, defaultLimit = 5, maxLimit = 20) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(searchParams.get('limit')) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export async function GET(req) {
  try {
    const user = await getUserFromRequest();
    const userId = user?.id || 0;
    const { searchParams } = new URL(req.url);
    const { page, limit, offset } = getPagination(searchParams);
    const [totalRows, savedPostsAvailable] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM posts'),
      hasTable('saved_posts')
    ]);
    const total = toCountNumber(totalRows[0]?.count);
    const savedSelect = savedPostsAvailable
      ? '(SELECT COUNT(*) FROM saved_posts WHERE post_id = posts.id AND user_id = ?) AS saved'
      : '0 AS saved';
    const safeLimit = Number(limit);
    const safeOffset = Number(offset);

    const paginatedPosts = await query(
      `SELECT posts.id, posts.user_id, posts.content, posts.media_url, posts.media_type, posts.created_at, posts.updated_at,
        users.first_name, users.last_name, users.username, users.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS comment_count,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id AND user_id = ?) AS liked,
        ${savedSelect}
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      savedPostsAvailable
        ? [userId, userId]
        : [userId]
    );

    return NextResponse.json(toJSONSafe({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        hasMore: offset + paginatedPosts.length < total
      }
    }));
  } catch (err) {
    console.error('[api/posts] GET failed', err);
    return NextResponse.json({ message: 'Failed to fetch posts.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }
    if (!user.profile_completed) {
      return NextResponse.json({ message: 'Complete your profile first.' }, { status: 403 });
    }

    const formData = await req.formData();
    const content = (formData.get('content') || '').trim();
    const mediaUrlInput = formData.get('mediaUrl');
    const mediaTypeInput = formData.get('mediaType');
    const mediaFile = formData.get('media');

    if (!content) {
      return NextResponse.json({ message: 'Post content is required.' }, { status: 400 });
    }
    if (content.length > 5000) {
      return NextResponse.json({ message: 'Post content must be 5000 characters or fewer.' }, { status: 400 });
    }

    let mediaUrl = mediaUrlInput || null;
    let mediaType = mediaTypeInput || null;

    if (!mediaUrl && mediaFile && typeof mediaFile !== 'string') {
      const upload = await saveUpload(mediaFile, MEDIA_TYPES, {
        folder: 'rangsit-social/post-media'
      });
      mediaUrl = upload.url;
      mediaType = upload.type;
    }

    const result = await query(
      'INSERT INTO posts (user_id, content, media_url, media_type, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [user.id, content, mediaUrl, mediaType]
    );

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error('[api/posts] POST failed', err);
    return NextResponse.json({ message: 'Failed to create post.' }, { status: 500 });
  }
}
