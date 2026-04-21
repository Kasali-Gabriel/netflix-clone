'use client';

import { AddProfileCard } from '@/components/Profile/AddProfileCard';
import { ProfileDialog } from '@/components/Profile/Dialogs';
import PageLoader from '@/components/Theme/pageLoader';
import { UserContext } from '@/context/UserContext';
import { useAddProfile } from '@/hooks/useAddProfile';
import { useProfileClick } from '@/hooks/useProfileClick';
import { useProfiles } from '@/hooks/useProfiles';
import { ProfileCardProps } from '@/types/Profile';
import Image from 'next/image';
import { useContext, useState } from 'react';

const ProfileCard = ({ name, imageSrc, onClick }: ProfileCardProps) => (
  <div
    onClick={onClick}
    className="group mx-auto w-32 flex-row sm:w-36 md:w-44"
  >
    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border-2 border-transparent group-hover:cursor-pointer group-hover:border-white sm:h-36 sm:w-36 md:h-44 md:w-44">
      <Image
        src={imageSrc}
        alt={`${name}-profile-img`}
        height={500}
        width={500}
        className="object-cover"
      />
    </div>

    <div className="mt-2 overflow-hidden text-ellipsis text-center text-2xl text-gray-500 group-hover:text-white md:mt-4">
      {name}
    </div>
  </div>
);

const Profiles = () => {
  const [profileName, setProfileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { user } = useContext(UserContext);
  const userId = user?.id;

  const { profiles, refreshProfiles, loading } = useProfiles(userId);

  const { handleProfileClick, isPending } = useProfileClick();

  const { handleAddProfile, isAdding: isAddProfilePending } = useAddProfile(
    profileName,
    selectedImage || '',
    refreshProfiles,
    userId || '',
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading || profiles === null) {
    return <PageLoader />;
  }

  const isEmpty = profiles.length === 0;

  return (
    <div className="absolute bottom-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl text-white md:text-6xl">Who is watching?</h1>

        <div
          className={`mt-12 ${
            isEmpty ? 'flex' : 'grid grid-cols-2'
          } items-center justify-center gap-6 md:gap-8 lg:flex`}
        >
          {profiles.map((profile) => (
            <button key={profile.id} disabled={isPending}>
              <ProfileCard
                name={profile.name}
                imageSrc={profile.imageSrc}
                onClick={() => handleProfileClick(profile)}
              />
            </button>
          ))}

          {profiles.length < 4 && <AddProfileCard onClick={handleOpenModal} />}
        </div>

        <ProfileDialog
          isPending={isAddProfilePending}
          profileName={profileName}
          setProfileName={setProfileName}
          selectedImage={selectedImage || ''}
          setSelectedImage={setSelectedImage}
          handleAddProfile={handleAddProfile}
          handleCloseModal={handleCloseModal}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </div>
  );
};

export default Profiles;
