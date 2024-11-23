'use client';

import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { AddProfileCard } from '../../../components/ProfileComponent/AddProfileCard';
import { ProfileDialog } from '../../../components/ProfileComponent/Dialogue';
import PageLoader from '../../../components/Theme/pageLoader';
import { UserContext } from '../../../context/UserContext';
import { GET_PROFILES } from '../../../graphql/queries';
import { useAddProfile } from '../../../hooks/useAddProfile';
import { useProfileClick } from '../../../hooks/useProfileClick';
import { Profile, ProfileCardProps } from '../../../types/Profile';

const ProfileCard = ({ name, imageSrc, onClick }: ProfileCardProps) => (
  <div
    onClick={onClick}
    className="group mx-auto w-32 flex-row sm:w-36 md:w-44"
  >
    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-md border-2 border-transparent group-hover:cursor-pointer group-hover:border-white sm:h-36 sm:w-36 md:h-44 md:w-44 ">
      <Image
        src={imageSrc}
        alt={`${name}-profile-img`}
        height={500}
        width={500}
        className="object-cover"
      />
    </div>
    <div className="mt-2 overflow-hidden overflow-ellipsis text-center text-2xl text-gray-500 group-hover:text-white md:mt-4">
      {name}
    </div>
  </div>
);

const Profiles = () => {
  const [profileName, setProfileName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const { user } = useContext(UserContext);
  const [userId, setUserId] = useState<string | null>(user?.id || null);

  const { handleProfileClick, isPending } = useProfileClick();
  const { handleAddProfile, isPending: isAddProfilePending } = useAddProfile(
    profileName,
    selectedImage || '',
    setProfiles,
    userId || '',
  );

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  const { loading, error } = useQuery(GET_PROFILES, {
    variables: { userId: userId },
    skip: !userId,
    onCompleted: (data) => {
      setProfiles(data.getProfiles);
    },
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="absolute bottom-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl text-white md:text-6xl">Who is watching?</h1>

        <div
          className={`mt-12 ${profiles.length === 0 ? 'flex' : 'grid grid-cols-2'} items-center justify-center gap-6 md:gap-8 lg:flex`}
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

          {/* Show Add Profile Card only if profiles are loaded */}
          {profiles.length < 4 && !loading && (
            <AddProfileCard onClick={handleOpenModal} />
          )}
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

        {error && <div className="mt-4 text-red-500">{error.message}</div>}
      </div>
    </div>
  );
};

export default Profiles;
