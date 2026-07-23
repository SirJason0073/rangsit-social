import Link from 'next/link';
import { formatDate } from '@/utils/format';
import Avatar from './ui/Avatar';

function displayName(comment) {
  const full = [comment.first_name, comment.last_name].filter(Boolean).join(' ');
  return full || comment.username || 'User';
}

export default function CommentCard({ comment }) {
  const name = displayName(comment);
  return (
    <article className="flex gap-3 border-b border-border py-4 last:border-b-0">
      <Avatar src={comment.user_avatar} alt={name} fallback={name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {comment.user_id ? <Link href={`/profile/${comment.user_id}`} className="text-sm font-semibold text-foreground hover:text-brand-strong">{name}</Link> : <span className="text-sm font-semibold text-foreground">{name}</span>}
          <time dateTime={comment.created_at} className="text-xs text-foreground-muted">{formatDate(comment.created_at)}</time>
        </div>
        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground-secondary">{comment.content}</p>
      </div>
    </article>
  );
}
