import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Profile } from '../types/Profile';
import useChangePage from './useChangePage';

export const useProfileClick = () => {
  const changePage = useChangePage();
  const pathname = usePathname();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleProfileClick = useCallback(
    (profile: Profile) => {
      Cookies.set('profileId', profile.id, {
        expires: 7,
      });
      startTransition(() => {
        if (pathname === '/profiles') {
          changePage('/Home');
        } else {
          router.refresh();
        }
      });
    },
    [pathname, changePage],
  );

  return { handleProfileClick, isPending };
};
