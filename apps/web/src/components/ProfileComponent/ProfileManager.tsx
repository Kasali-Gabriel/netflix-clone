'use client';

import { ChevronsUpDownIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useAddProfile } from '../../hooks/useAddProfile';
import { useProfileClick } from '../../hooks/useProfileClick';
import { ProfileManagerProps } from '../../types/Profile';
import { ThemeToggler } from '../Theme/ThemeToggler';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { AddProfileCard } from './AddProfileCard';
import { ProfileDialog } from './Dialogue';
import { ProfileList } from './ProfileList';

export const ProfileManager = ({
  profile,
  profiles,
  setProfiles,
  isLoading,
  setIsProfileOpen,
  userId,
}: ProfileManagerProps) => {
  useState<string | null>(null);
  const [profileName, setProfileName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const { handleProfileClick } = useProfileClick();
  const { handleAddProfile, isPending } = useAddProfile(
    profileName,
    selectedImage || '',
    setProfiles,
    userId || '',
  );

  const profilesLength = profiles.length + (profile ? 1 : 0);

  return (
    <div className="flex flex-col pr-3">
      <div className="flex w-full flex-row items-center justify-between">
        <Image
          src={profile.imageSrc}
          alt="profile icon"
          width={50}
          height={50}
          className="rounded-md"
        />
        <div className="-mr-5 -mt-3">
          <ThemeToggler />
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="my-2 flex w-full items-center justify-between">
          <h1 className="text-xl font-semibold sm:text-2xl">{profile.name}</h1>
          <CollapsibleTrigger asChild>
            <ChevronsUpDownIcon className="ml-2 cursor-pointer" />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="mt-2 border-b border-gray-400" />
          <ProfileList
            profiles={profiles}
            handleProfileClick={handleProfileClick}
            setIsProfileOpen={setIsProfileOpen}
          />
          {profilesLength < 4 && !isLoading && (
            <div className="mt-2 flex justify-start">
              <AddProfileCard onClick={handleOpenModal} />
              <ProfileDialog
                isPending={isPending}
                profileName={profileName}
                setProfileName={setProfileName}
                selectedImage={selectedImage || ''}
                setSelectedImage={setSelectedImage}
                handleAddProfile={handleAddProfile}
                handleCloseModal={handleCloseModal}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setIsProfileOpen={setIsProfileOpen}
              />
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-2 border-b border-gray-400" />
    </div>
  );
};

export default ProfileManager;
