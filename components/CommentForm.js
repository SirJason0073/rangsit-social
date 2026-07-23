'use client';

import { useId, useState } from 'react';
import Button from './ui/Button';
import { TextInput } from './ui/Field';

export default function CommentForm({ onSubmit }) {
  const inputId = useId();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    if (content.trim().length > 300) {
      setError('Comment must be 300 characters or fewer.');
      return;
    }
    setError('');
    setLoading(true);
    await onSubmit(content.trim());
    setContent('');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div className="flex gap-3">
        <TextInput
          id={inputId}
          name="comment"
          aria-label="Write a comment"
          className="flex-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </div>
      {error ? <p role="alert" aria-live="polite" className="text-sm text-danger">{error}</p> : null}
    </form>
  );
}
