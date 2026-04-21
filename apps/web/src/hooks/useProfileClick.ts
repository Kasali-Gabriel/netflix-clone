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
    (
      profile: Profile,
      setSwitchingProfile?: (v: boolean) => void,
      setIsProfileOpen?: (v: boolean) => void,
    ) => {
      Cookies.set('profileId', profile.id, { expires: 7 });

      setSwitchingProfile?.(true);

      startTransition(() => {
        if (pathname === '/profiles') {
          changePage('/Home');
        } else {
          router.refresh();
        }

        setIsProfileOpen?.(false);
        setSwitchingProfile?.(false);
      });
    },
    [pathname, changePage],
  );

  return { handleProfileClick, isPending };
};
