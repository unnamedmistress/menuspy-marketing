import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PermitFlow Demo',
  description: 'Public no-auth sandbox for permit prediction, chat, theater, and analytics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
