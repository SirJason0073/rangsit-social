import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: {
    default: 'Rangsit Social',
    template: '%s · Rangsit Social'
  },
  description: 'The university social network for the Rangsit community.'
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
