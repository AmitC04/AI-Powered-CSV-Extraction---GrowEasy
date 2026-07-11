import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'GrowEasy AI Importer — AI-Powered CRM Lead Extraction',
  description: 'Upload any CSV and let AI intelligently map and extract CRM leads into GrowEasy format. Works with Facebook exports, Google Ads, Excel sheets and more.',
  keywords: 'CRM, CSV importer, AI, lead extraction, GrowEasy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
