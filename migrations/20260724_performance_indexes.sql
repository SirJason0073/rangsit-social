-- Run once against an existing Rangsit Social database.
-- These indexes match feed ordering, profile pagination, comments, and notification lookups.

ALTER TABLE users
  ADD INDEX idx_users_suggestions (profile_completed, created_at);

ALTER TABLE posts
  ADD INDEX idx_posts_feed (created_at, id),
  ADD INDEX idx_posts_user_feed (user_id, created_at, id);

ALTER TABLE comments
  ADD INDEX idx_comments_post_created (post_id, created_at, id),
  ADD INDEX idx_comments_user_created (user_id, created_at);

ALTER TABLE likes
  ADD INDEX idx_likes_user_created (user_id, created_at);

ALTER TABLE saved_posts
  ADD INDEX idx_saved_posts_user_created (user_id, created_at, post_id),
  ADD INDEX idx_saved_posts_post (post_id);

ALTER TABLE follows
  ADD INDEX idx_follows_following_created (following_id, created_at, follower_id);

ANALYZE TABLE users, posts, comments, likes, saved_posts, follows;
