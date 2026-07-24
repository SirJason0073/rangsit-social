'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from './Providers';
import { uploadPostMedia } from '@/utils/upload-client';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import { Card } from './ui/Card';
import { FieldError } from './ui/Field';
import Icon from './ui/Icon';
import { useToast } from './ui/Toast';

export default function InlineComposer({ onOptimisticAdd, onOptimisticConfirm, onOptimisticRollback }) {
  const { user } = useAuth();
  const { notify } = useToast();
  const inputId = useId();
  const fileId = useId();
  const textRef = useRef(null);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => () => {
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function chooseMedia(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Choose an image or video file.');
      event.target.value = '';
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('Choose a file smaller than 25 MB.');
      event.target.value = '';
      return;
    }
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setMediaFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  }

  function removeMedia() {
    if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setMediaFile(null);
    setPreviewUrl('');
  }

  async function publish(event) {
    event.preventDefault();
    const message = content.trim();
    if (!message) {
      setError('Write something before publishing.');
      textRef.current?.focus();
      return;
    }
    if (message.length > 5000) {
      setError('Keep your post within 5,000 characters.');
      textRef.current?.focus();
      return;
    }

    const temporaryId = `optimistic-${Date.now()}`;
    const optimisticPost = {
      id: temporaryId,
      user_id: user.id,
      content: message,
      media_url: previewUrl || null,
      media_type: mediaFile?.type.startsWith('video/') ? 'video' : (mediaFile ? 'image' : null),
      created_at: new Date().toISOString(),
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      author_avatar: user.avatar,
      like_count: 0,
      comment_count: 0,
      liked: 0,
      saved: 0,
      pending: true
    };

    onOptimisticAdd(optimisticPost);
    setPublishing(true);
    setError('');

    try {
      let uploadedMedia = null;
      if (mediaFile) {
        setStatus('Uploading media');
        uploadedMedia = await uploadPostMedia(mediaFile);
      }

      setStatus('Publishing post');
      const payload = new FormData();
      payload.append('content', message);
      if (uploadedMedia) {
        payload.append('mediaUrl', uploadedMedia.url);
        payload.append('mediaType', uploadedMedia.mediaType);
      }

      const response = await fetch('/api/posts', { method: 'POST', body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Post could not be published.');

      onOptimisticConfirm(temporaryId, {
        id: data.id,
        media_url: uploadedMedia?.url || null,
        media_type: uploadedMedia?.mediaType || null
      });
      setContent('');
      setMediaFile(null);
      setPreviewUrl('');
      setStatus('');
      notify('Your post is live.', { tone: 'success' });
      textRef.current?.focus();
    } catch (requestError) {
      onOptimisticRollback(temporaryId);
      setError(requestError.message || 'Post could not be published. Your draft is still here.');
      notify('Publishing failed. Your draft was restored.', { tone: 'danger' });
    } finally {
      setPublishing(false);
      setStatus('');
    }
  }

  function handleKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      publish(event);
    }
  }

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'You';

  return (
    <Card as="form" onSubmit={publish} className="overflow-hidden p-4 md:p-5" aria-label="Create a post">
      <div className="flex items-start gap-3">
        <Avatar src={user?.avatar} alt={name} fallback={name} size="md" />
        <label htmlFor={inputId} className="sr-only">Post content</label>
        <textarea
          ref={textRef}
          id={inputId}
          name="content"
          rows="2"
          value={content}
          maxLength={5000}
          onChange={(event) => {
            setContent(event.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Share something with campus..."
          className="min-h-20 flex-1 resize-none border-0 bg-transparent px-1 py-2 text-[15px] leading-6 text-foreground outline-none placeholder:text-foreground-muted"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
          disabled={publishing}
        />
      </div>

      {previewUrl ? (
        <div className="relative mt-3 overflow-hidden rounded-card border border-border bg-surface-muted">
          {mediaFile?.type.startsWith('video/') ? (
            <video src={previewUrl} className="max-h-80 w-full object-contain" controls preload="metadata" />
          ) : (
            <img src={previewUrl} alt="Selected post media preview" decoding="async" className="max-h-80 w-full object-contain" />
          )}
          <button type="button" onClick={removeMedia} disabled={publishing} className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-inverse/80 text-foreground-inverse shadow-1 hover:bg-surface-inverse" aria-label="Remove selected media">
            <Icon name="close" size="sm" />
          </button>
        </div>
      ) : null}

      <FieldError id={`${inputId}-error`} aria-live="polite">{error}</FieldError>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-1">
          <label htmlFor={fileId} className="btn btn-ghost min-h-11 cursor-pointer px-3 focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-surface">
            <Icon name="image" size="sm" />
            <span>Photo or video</span>
          </label>
          <input id={fileId} type="file" accept="image/*,video/*" className="sr-only" onChange={chooseMedia} disabled={publishing} />
          <span id={`${inputId}-hint`} className="hidden text-xs text-foreground-muted sm:inline">Press ⌘/Ctrl + Enter to publish</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-foreground-muted" aria-live="polite">{publishing ? status : `${content.length}/5000`}</span>
          <Button type="submit" size="sm" loading={publishing} loadingLabel="Publishing" disabled={!content.trim()}>
            Publish
          </Button>
        </div>
      </div>
    </Card>
  );
}
