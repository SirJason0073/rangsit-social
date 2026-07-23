'use client';

import { useEffect, useId, useState } from 'react';
import { uploadPostMedia } from '@/utils/upload-client';
import Button from './ui/Button';
import { Card, SubtlePanel } from './ui/Card';
import { FieldError, FieldHint, FieldLabel, TextArea, UploadControl } from './ui/Field';

export default function PostForm({ initial = { content: '', media_url: null, media_type: null }, onSubmit, submitLabel }) {
  const contentId = useId();
  const mediaId = useId();
  const hintId = useId();
  const errorId = useId();
  const [content, setContent] = useState(initial.content || '');
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initial.media_url || '');
  const [previewType, setPreviewType] = useState(initial.media_type || null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Choose an image or video file.');
      e.target.value = '';
      return;
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setMediaFile(file);
    setPreviewUrl(url);
    setPreviewType(file.type.startsWith('video/') ? 'video' : 'image');
    setRemoveMedia(false);
    setError('');
  }

  function handleRemoveMedia() {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setMediaFile(null);
    setPreviewUrl('');
    setPreviewType(null);
    setRemoveMedia(true);
  }

  function validateForm() {
    if (!content.trim()) return 'Post content is required.';
    if (content.trim().length > 5000) return 'Post content must be 5000 characters or fewer.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = new FormData();
      payload.append('content', content.trim());
      if (removeMedia) payload.append('removeMedia', 'true');

      if (mediaFile) {
        const uploadedMedia = await uploadPostMedia(mediaFile);
        payload.append('mediaUrl', uploadedMedia.url);
        payload.append('mediaType', uploadedMedia.mediaType);
      }

      await onSubmit(payload);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="space-y-6 p-6 md:p-7">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <FieldLabel htmlFor={contentId}>Post content</FieldLabel>
          <span className="text-xs text-foreground-muted">{content.length}/5000</span>
        </div>
        <TextArea
          id={contentId}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What is happening around campus today?"
          aria-describedby={`${hintId}${error ? ` ${errorId}` : ''}`}
          aria-invalid={!!error}
          required
        />
        <FieldHint id={hintId}>Keep it clear and readable. One strong update works better than a long block.</FieldHint>
      </div>

      <SubtlePanel className="rounded-panel border-dashed border-border p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <FieldLabel htmlFor={mediaId}>Media upload</FieldLabel>
            <p className="mt-1 text-sm text-foreground-muted">
              Add one image or video. This keeps the composer simple and reliable for the demo.
            </p>
          </div>
          <span className="badge">Image or video</span>
        </div>
        <UploadControl
          id={mediaId}
          name="media"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="mt-4"
          label={mediaFile ? mediaFile.name : 'Choose an image or video'}
          hint="One file per post. Preview it before publishing."
        />
        {previewUrl && (
          <div className="mt-4 space-y-3">
            {previewType === 'video' ? (
              <video
                src={previewUrl}
                className="w-full max-h-96 rounded-panel border border-border bg-surface-inverse"
                controls
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-96 rounded-panel border border-border object-cover"
              />
            )}
            <Button type="button" onClick={handleRemoveMedia} variant="ghost" className="text-danger hover:bg-danger-subtle hover:text-danger">
              Remove media
            </Button>
          </div>
        )}
      </SubtlePanel>

      <FieldError id={errorId} aria-live="polite">{error}</FieldError>
      <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
        <p className="text-xs text-foreground-muted">
          Your post will appear in the campus feed as soon as it is published.
        </p>
        <Button type="submit" loading={loading} loadingLabel="Saving">{submitLabel}</Button>
      </div>
    </Card>
  );
}
