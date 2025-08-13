// GLOBAL LAYOUT - This file applies the main menu and search bar accross pages.

import { KoHo, Jaro, Roboto } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Providers } from './providers';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './../styles/globals.css';
// import MainMenu from '../../components/shared/MainMenu';
// import SearchBar from '../../components/shared/SearchBar';
// import BusinessControl from '@/components/restaurantProfile/BusinessControl';
import LayoutContent from '@/components/shared/LayoutContent';

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

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata = {
  title: 'BiteClub',
  description: 'A social platform for food lovers',
};

export default function RootLayout({ children }) {
  // const { user } = useUser(); // Current logged-in user's Supabase info
  // const userType = user?.user_metadata?.user_type || null;

  return (
    <html
      lang="en"
      className={`${jaro.variable} ${koho.variable} ${roboto.variable} antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="flex" suppressHydrationWarning={true}>
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
