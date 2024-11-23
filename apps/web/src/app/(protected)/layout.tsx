'use client';

import { config } from '@fortawesome/fontawesome-svg-core';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/NavigationComponents/Header';
import { ThemeProvider } from '../../components/Theme/ThemeProvider';
import { Toaster } from '../../components/ui/toaster';
import { UserContext } from '../../context/UserContext';

config.autoAddCss = false;

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profileId = Cookies.get('profileId');

  const { user } = useContext(UserContext);
  const userId = user?.id;

  return (
    <main className="relative bg-white dark:bg-black/35">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {profileId && userId && (
          <Header profileId={profileId} userId={userId} />
        )}
        <main>{children}</main>
        <Toaster />
        <Footer />
      </ThemeProvider>
    </main>
  );
}
