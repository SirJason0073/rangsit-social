import { ImageResponse } from 'next/og';

export const alt = 'Rangsit Social - University Network';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(135deg, #123b8f 0%, #1d4ed8 52%, #0ea5e9 100%)',
          color: '#ffffff',
          display: 'flex',
          height: '100%',
          justifyContent: 'space-between',
          padding: '72px 88px',
          width: '100%'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 760 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 8, opacity: 0.8 }}>
            UNIVERSITY NETWORK
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, letterSpacing: -4, marginTop: 28 }}>
            Rangsit Social
          </div>
          <div style={{ fontSize: 34, lineHeight: 1.35, marginTop: 24, opacity: 0.9 }}>
            Connect, share, and discover campus life.
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            background: 'rgba(255,255,255,0.14)',
            border: '2px solid rgba(255,255,255,0.35)',
            borderRadius: 48,
            display: 'flex',
            fontSize: 92,
            fontWeight: 800,
            height: 230,
            justifyContent: 'center',
            width: 230
          }}
        >
          RS
        </div>
      </div>
    ),
    size
  );
}
