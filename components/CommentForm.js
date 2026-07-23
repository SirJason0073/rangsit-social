'use client';

import { useState } from 'react';
import Button from './ui/Button';
import { TextInput } from './ui/Field';

export default function CommentForm({ onSubmit }) {
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
          className="flex-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </form>
  );
}
