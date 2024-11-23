import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export const AddProfileCard = ({ onClick }: { onClick: () => void }) => {
  const pathname = usePathname();
  const isProfilesPage = pathname === '/profiles';

  return (
    <div
      onClick={onClick}
      className={` group cursor-pointer  ${
        isProfilesPage
          ? 'mx-auto flex w-32 flex-col items-center justify-center sm:w-36 md:w-44'
          : 'flex flex-row items-center justify-start'
      }`}
    >
      <div
        className={`${
          isProfilesPage
            ? 'flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-400 sm:h-36 sm:w-36 sm:group-hover:border-white md:h-44 md:w-44'
            : 'flex border-none text-black transition-all duration-100  sm:group-hover:scale-105'
        }`}
      >
        <Plus
          className={`${
            isProfilesPage
              ? 'h-16 w-16 text-gray-400 group-hover:text-white'
              : 'h-8 w-8 text-black transition-all duration-100 sm:group-hover:scale-105 dark:text-white'
          }`}
        />
      </div>
      <div
        className={`text-gray-500 ${
          isProfilesPage
            ? 'mt-4 text-center text-2xl group-hover:text-white'
            : 'ml-4 text-start text-lg font-medium text-black transition-all duration-100 sm:group-hover:scale-105 dark:text-white'
        }`}
      >
        Add Profile
      </div>
    </div>
  );
};
