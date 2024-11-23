export interface ProfileCardProps {
  onClick: () => void;
  name: string;
  imageSrc: string;
}

export interface ProfileDialogProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  isPending: boolean;
  profileName: string;
  setProfileName: (name: string) => void;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
  handleAddProfile: () => void;
  handleCloseModal: () => void;
  setIsProfileOpen?: (isOpen: boolean) => void;
}

export interface DeleteProfileDialogProps {
  profileId: string;
  onClose: () => void;
  onDeleteSuccess: () => void;
}

export interface ChangeProfileNameDialogProps {
  profileId: string;
  oldName: string;
  onClose: () => void;
  onChangeSuccess: () => void;
}

export interface ProfileManagerProps {
  profile: Profile;
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  isLoading: boolean;
  userId: string;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ProfileListProps {
  profiles: Profile[];
  handleProfileClick: (profile: Profile) => void;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Interface for user profile information
export interface Profile {
  id: string;
  name: string;
  imageSrc: string;
  userId?: string;
}
