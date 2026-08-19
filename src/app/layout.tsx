import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project DNA : แพลตฟอร์มอัจฉริยะเพื่อค้นหา เชื่อมโยง และต่อยอดโครงงานนิสิต',
  description: 'An Intelligent Platform for Discovering, Connecting, and Extending Student Projects - SDGs-KUSE NONTRI E-SAN HACKATHON 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased bg-slate-100/70 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
