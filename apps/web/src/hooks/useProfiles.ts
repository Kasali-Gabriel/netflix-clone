import { DELETE_PROFILE, RENAME_PROFILE } from '@/graphql/mutations';
import { GET_PROFILE, GET_PROFILES } from '@/graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';

export const useProfiles = (userId?: string, profileId?: string) => {
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useQuery(GET_PROFILE, {
    variables: { id: profileId },
    skip: !profileId,
  });

  const {
    data: profilesData,
    loading: profilesLoading,
    refetch: refetchProfilesQuery,
  } = useQuery(GET_PROFILES, {
    variables: { userId: userId! },
    skip: !userId,
    fetchPolicy: 'cache-and-network',
  });

  const profile = profileData?.getProfile;
  const profiles = profilesData?.getProfiles ?? [];

  const refreshProfiles = useCallback(async () => {
    const tasks = [refetchProfilesQuery()];
    if (profileId) tasks.push(refetchProfile());

    await Promise.all(tasks);
  }, [refetchProfile, refetchProfilesQuery, profileId]);

  const [deleteProfileMutation] = useMutation(DELETE_PROFILE);
  const [renameProfileMutation] = useMutation(RENAME_PROFILE);

  const deleteProfile = async (id: string, onClose?: () => void) => {
    await deleteProfileMutation({ variables: { id } });
    await refreshProfiles();
    onClose?.();
  };

  const renameProfile = async (
    id: string,
    name: string,
    onClose?: () => void,
  ) => {
    await renameProfileMutation({ variables: { id, name } });
    await refreshProfiles();
    onClose?.();
  };

  return {
    profile,
    profiles,
    loading: profileLoading || profilesLoading,
    refreshProfiles,
    deleteProfile,
    renameProfile,
  };
};
