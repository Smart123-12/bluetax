import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BlueTax — Keep More of Your Paycheck',
  description: 'Free, privacy-first US tax optimizer for W2 employees. See your real take-home, understand every deduction, and discover personalized savings — all client-side, no data stored.',
  keywords: ['tax optimizer', 'take home pay calculator', 'US tax', 'California tax', '401k savings', 'W2 employee'],
  openGraph: {
    title: 'BlueTax — Keep More of Your Paycheck',
    description: 'Privacy-first US tax optimizer. Understand your taxes and find ways to save — instantly, for free.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
