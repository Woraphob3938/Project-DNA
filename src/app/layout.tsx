import type { Metadata } from 'next';
import { Prompt, Sarabun } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  weight: ['400', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  variable: '--font-prompt',
  display: 'swap',
});

const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-sarabun',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Project DNA : แพลตฟอร์มอัจฉริยะเพื่อค้นหา เชื่อมโยง และต่อยอดโครงงานนิสิต',
  description: 'An Intelligent Platform for Discovering, Connecting, and Extending Student Projects - มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="th" 
      className={`${prompt.variable} ${sarabun.variable}`}
      suppressHydrationWarning
    >
      <body 
        className="antialiased font-sans bg-[#F4F5F7] text-slate-900 min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
