'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Navigation/Header';
import { Toaster } from '@/components/ui/toaster';
import { UserContext } from '@/context/UserContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import Cookies from 'js-cookie';
import { useContext } from 'react';
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
      {profileId && userId && <Header profileId={profileId} userId={userId} />}
      <main>{children}</main>
      <Toaster />
      <Footer />
    </main>
  );
}
