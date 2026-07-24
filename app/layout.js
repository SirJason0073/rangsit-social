import './globals.css';
import Providers from '@/components/Providers';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Rangsit Social',
  title: {
    default: 'Rangsit Social',
    template: '%s · Rangsit Social'
  },
  description: 'The university social network for the Rangsit community.',
  keywords: ['Rangsit University', 'campus social network', 'student community'],
  authors: [{ name: 'Rangsit Social' }],
  creator: 'Rangsit Social',
  icons: {
    icon: '/rangsit-logo.png',
    apple: '/rangsit-logo.png'
  },
  openGraph: {
    type: 'website',
    siteName: 'Rangsit Social',
    title: 'Rangsit Social',
    description: 'Connect, share, and discover what is happening across the Rangsit community.',
    url: '/'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rangsit Social',
    description: 'The university social network for the Rangsit community.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark'
};

const themeScript = `
  try {
    const stored = localStorage.getItem('rangsit-theme');
    const theme = stored === 'light' || stored === 'dark'
      ? stored
      : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
