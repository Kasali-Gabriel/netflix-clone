'use client';

import { MoreHorizontal, Pen, Trash } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ProfileListProps } from '../../types/Profile';
import { refetchProfiles } from '../NavigationComponents/Header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ChangeProfileNameDialog, DeleteProfileDialog } from './Dialogue';

export const ProfileList = ({
  profiles,
  handleProfileClick,
  setIsProfileOpen,
}: ProfileListProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const handleOpenDeleteDialog = (profileId: string) => {
    setProfileToDelete(profileId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchProfiles();
  };

  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);

  const [profileToChangeName, setProfileToChangeName] = useState<string | null>(
    null,
  );

  const [oldProfileName, setOldProfileName] = useState<string | null>(null);

  const handleOpenChangeNameDialog = (profileId: string, oldName: string) => {
    setProfileToChangeName(profileId);
    setOldProfileName(oldName);
    setIsChangeNameDialogOpen(true);
  };

  const handleCloseChangeNameDialog = () => {
    setIsChangeNameDialogOpen(false);
  };

  const handleChangeSuccess = () => {
    refetchProfiles();
  };

  return (
    <>
      {profiles.map((p, index) => (
        <div key={index} className="flex items-center justify-between pt-4">
          <button
            className="flex items-center justify-start text-lg transition-all duration-100 sm:hover:scale-105"
            onClick={() => {
              handleProfileClick(p);
              setIsProfileOpen(false);
            }}
          >
            <Image
              src={p.imageSrc}
              alt="profile icon"
              width={30}
              height={30}
              className="mr-4 rounded-lg"
            />
            {p.name}
          </button>

          <TooltipProvider>
            <Tooltip>
              <DropdownMenu>
                <TooltipTrigger>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="h-6 w-6 cursor-pointer text-gray-500 dark:text-white" />
                  </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Options</p>
                </TooltipContent>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Manage Profile</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => handleOpenChangeNameDialog(p.id, p.name)}
                  >
                    Rename
                    <DropdownMenuShortcut>
                      <Pen className="mr-2 h-4 w-4" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleOpenDeleteDialog(p.id)}
                  >
                    Delete
                    <DropdownMenuShortcut>
                      <Trash className="mr-2 h-4 w-4" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {isDeleteDialogOpen && profileToDelete && (
                <DeleteProfileDialog
                  profileId={profileToDelete}
                  onClose={handleCloseDeleteDialog}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              )}

              {isChangeNameDialogOpen &&
                profileToChangeName &&
                oldProfileName && (
                  <ChangeProfileNameDialog
                    profileId={profileToChangeName}
                    oldName={oldProfileName}
                    onClose={handleCloseChangeNameDialog}
                    onChangeSuccess={handleChangeSuccess}
                  />
                )}
            </Tooltip>
          </TooltipProvider>
        </div>
      ))}
    </>
  );
};

export default ProfileList;
