'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Icon from './ui/Icon';
import { usePreferences } from './PreferencesProvider';

const Dialog = dynamic(() => import('./ui/Dialog'), { ssr: false });

function normalizeMedia(post) {
  if (Array.isArray(post.media_urls)) {
    return post.media_urls.map((item) => typeof item === 'string' ? { url: item, type: 'image' } : item);
  }
  return post.media_url ? [{ url: post.media_url, type: post.media_type || 'image' }] : [];
}

export default function PostMedia({ post, authorName }) {
  const { preferences } = usePreferences();
  const media = useMemo(() => normalizeMedia(post), [post]);
  const [activeIndex, setActiveIndex] = useState(null);
  if (!media.length) return null;

  const gridClass = media.length === 1
    ? 'grid-cols-1'
    : media.length === 2
      ? 'grid-cols-2'
      : 'grid-cols-2';

  return (
    <>
      <div className={`mx-4 mt-4 grid max-h-[38rem] gap-1 overflow-hidden rounded-card border border-border bg-surface-muted md:mx-5 ${gridClass}`}>
        {media.slice(0, 4).map((item, index) => (
          <button
            key={`${item.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`media-tile relative min-h-48 overflow-hidden bg-surface-muted text-left focus-visible:z-10 ${media.length === 1 ? 'aspect-[4/3]' : 'aspect-square'}`}
            aria-label={`Open media ${index + 1} of ${media.length}`}
          >
            {item.type === 'video' ? (
              <>
                <video src={item.url} className="media-image h-full w-full object-cover" preload={preferences.dataSaver ? 'none' : 'metadata'} muted autoPlay={preferences.autoplayVideo && !preferences.dataSaver} loop={preferences.autoplayVideo && !preferences.dataSaver} playsInline />
                <span className="absolute inset-0 flex items-center justify-center bg-surface-inverse/15">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-elevated/90 text-foreground shadow-2"><Icon name="play" /></span>
                </span>
              </>
            ) : item.url.startsWith('blob:') ? (
              <img src={item.url} alt={`Media shared by ${authorName}`} decoding="async" className="media-image h-full w-full object-cover" />
            ) : (
              <Image src={item.url} alt={`Media shared by ${authorName}`} fill sizes="(max-width: 768px) 100vw, 720px" className="media-image object-cover" />
            )}
            {index === 3 && media.length > 4 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-surface-inverse/60 text-2xl font-semibold text-foreground-inverse">+{media.length - 4}</span>
            ) : null}
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <Dialog
          open
          onOpenChange={(open) => { if (!open) setActiveIndex(null); }}
          title={`Media from ${authorName}`}
          description={`Item ${activeIndex + 1} of ${media.length}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-card bg-surface-inverse">
              {media[activeIndex].type === 'video' ? (
                <video src={media[activeIndex].url} className="max-h-[70dvh] w-full" controls autoPlay preload="metadata" />
              ) : media[activeIndex].url.startsWith('blob:') ? (
                <img src={media[activeIndex].url} alt={`Expanded media shared by ${authorName}`} decoding="async" className="max-h-[70dvh] w-full object-contain" />
              ) : (
                <Image
                  src={media[activeIndex].url}
                  alt={`Expanded media shared by ${authorName}`}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 960px"
                  className="max-h-[70dvh] w-full object-contain"
                />
              )}
            </div>
            {media.length > 1 ? (
              <div className="flex items-center justify-between gap-3">
                <button type="button" className="btn btn-outline" disabled={activeIndex === 0} onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}><Icon name="chevronLeft" size="sm" />Previous</button>
                <button type="button" className="btn btn-outline" disabled={activeIndex === media.length - 1} onClick={() => setActiveIndex((index) => Math.min(media.length - 1, index + 1))}>Next<Icon name="chevronRight" size="sm" /></button>
              </div>
            ) : null}
          </div>
        </Dialog>
      ) : null}
    </>
  );
}
