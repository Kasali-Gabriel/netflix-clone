import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { useState } from 'react';
import { DELETE_PROFILE, RENAME_PROFILE } from '../../graphql/mutations';
import {
  ChangeProfileNameDialogProps,
  DeleteProfileDialogProps,
  ProfileDialogProps,
} from '../../types/Profile';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const ProfileDialog = ({
  profileName,
  setProfileName,
  selectedImage,
  setSelectedImage,
  handleAddProfile,
  handleCloseModal,
  isModalOpen,
  setIsModalOpen,
  isPending,
  setIsProfileOpen,
}: ProfileDialogProps) => {
  // Predefined profile images
  const predefinedImages = [
    '/netflix-profile-blue.webp',
    '/netflix-profile-yellow.webp',
    '/netflix-profile-red.webp',
    '/netflix-profile-green.webp',
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>Create a Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="profileName">Profile Name</Label>
          <Input
            id="profileName"
            type="text"
            disabled={isPending}
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Enter profile name"
          />

          {/* Display predefined images for selection */}
          <Label>Select a Profile Image</Label>

          <div className="flex space-x-4">
            {predefinedImages.map((image) => (
              <div
                key={image}
                className={`h-14 w-14 cursor-pointer overflow-hidden rounded-md border-2 md:h-20 md:w-20 ${
                  selectedImage === image
                    ? 'border-[3px] border-green-500'
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt="profile-img"
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            variant="default"
            onClick={() => {
              handleAddProfile();
              setIsProfileOpen && setIsProfileOpen(false);
            }}
            disabled={
              !profileName ||
              profileName.length < 3 ||
              !selectedImage ||
              isPending
            }
          >
            Save
          </Button>
          <Button
            type="submit"
            variant="secondary"
            disabled={isPending}
            onClick={handleCloseModal}
            className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ChangeProfileNameDialog = ({
  profileId,
  oldName,
  onClose,
  onChangeSuccess,
}: ChangeProfileNameDialogProps) => {
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [renameProfile] = useMutation(RENAME_PROFILE, {
    onCompleted: async (data) => {
      if (data?.renameProfile) {
        onChangeSuccess();
        onClose();
        setIsLoading(false);
      }
    },
  });

  const handleChangeName = async () => {
    setIsLoading(true);
    await renameProfile({ variables: { id: profileId, name: newName } });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] rounded-md sm:max-w-[60%] lg:max-w-[40%]">
        <DialogHeader>
          <DialogTitle>Change Profile Name</DialogTitle>
          <DialogDescription>
            <Input
              type="text"
              value={newName}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !isLoading &&
                  newName.length >= 3 &&
                  newName !== oldName
                ) {
                  handleChangeName();
                }
              }}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="mt-2 text-lg text-black dark:text-white"
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2">
          <Button variant="destructive" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleChangeName();
            }}
            disabled={isLoading || newName.length < 3 || newName === oldName}
            className="bg-green-700 text-white hover:bg-green-600"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteProfileDialog = ({
  profileId,
  onClose,
  onDeleteSuccess,
}: DeleteProfileDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [deleteProfile] = useMutation(DELETE_PROFILE, {
    onCompleted: async (data) => {
      if (data?.deleteProfile) {
        onDeleteSuccess();
        onClose();
        setIsLoading(false);
      }
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteProfile({ variables: { id: profileId } });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex max-w-[90%] flex-col rounded-md sm:max-w-[60%] lg:max-w-[40%]">
        <DialogHeader className="flex flex-col items-center justify-center">
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this profile?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex w-full flex-row items-center justify-center gap-2 sm:justify-center">
          <Button
            className="bg-stone-600 text-white hover:bg-stone-500"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              handleDelete();
            }}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
