import { KoHo, Jaro } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/app/styles/globals.css';

config.autoAddCss = false;

const koho = KoHo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-koho',
  display: 'swap',
});

const jaro = Jaro({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-jaro',
  display: 'swap',
});

export const metadata = {
  title: 'Auth Pages',
  description: 'Authentication layout',
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en" className={`${jaro.variable} ${koho.variable} antialiased`}>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
