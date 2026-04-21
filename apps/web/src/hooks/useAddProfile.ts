import { CREATE_PROFILE } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useProfileClick } from './useProfileClick';

export const useAddProfile = (
  profileName: string,
  selectedImage: string,
  refreshProfiles: () => Promise<void>,
  userId: string,
  setSwitchingProfile?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleProfileClick } = useProfileClick();

  const [createProfile] = useMutation(CREATE_PROFILE);

  const handleAddProfile = async () => {
    if (!profileName || !selectedImage || !userId || isAdding) return;

    setIsAdding(true);
    setSwitchingProfile?.(true);

    try {
      const { data } = await createProfile({
        variables: {
          profileInput: {
            name: profileName,
            imageSrc: selectedImage,
            userId,
          },
        },
      });

      const profile = data?.createProfile;
      if (!profile) return;

      await refreshProfiles();
      handleProfileClick(profile);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setIsAdding(false);
      setSwitchingProfile?.(false);
    }
  };

  return { handleAddProfile, isAdding, error };
};
