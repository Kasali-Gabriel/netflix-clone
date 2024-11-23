import { useMutation } from '@apollo/client';
import { useState, useTransition } from 'react';
import { CREATE_PROFILE } from '../graphql/mutations';
import { useProfileClick } from './useProfileClick';

export const useAddProfile = (
  profileName: string,
  selectedImage: string,
  setProfiles: Function,
  userId: string,
) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { handleProfileClick } = useProfileClick();

  const [createProfile] = useMutation(CREATE_PROFILE, {
    onCompleted: async (data) => {
      if (data?.createProfile) {
        const profile = data.createProfile;
        setProfiles((prev: any) => [...prev, profile]);
        handleProfileClick(profile);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleAddProfile = async () => {
    if (!profileName || !selectedImage || !userId) return;

    startTransition(async () => {
      try {
        await createProfile({
          variables: {
            profileInput: {
              name: profileName,
              imageSrc: selectedImage,
              userId: userId,
            },
          },
        });
      } catch (err) {
        console.error('Error:', error);
      }
    });
  };

  return { handleAddProfile, isPending, error };
};
