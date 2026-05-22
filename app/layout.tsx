import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MediTrack — Patient Records Portal',
  description: 'Secure patient records management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

