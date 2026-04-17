import { Profile } from './Profile';

// Props for the search page
export interface SearchPageProps {
  params: Promise<{
    term: string;
  }>;
}

// Props for the genre page
export interface GenrePageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    genre: string;
  }>;
}

// Props for the movie page
export interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface NavBarProps {
  showBackground: boolean;
  isHome: boolean;
  profile: Profile;
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  isLoading: boolean;
  userId: string;
}

// Props for rows displayed on the home screen
export interface HomeScreenRowsProps {
  h1: string;
  h2: string;
  imageSrc: string;
  isReversed?: boolean;
}

// Props for the disclosures component
export interface DisclosuresProps {
  title: string;
  children: string;
}

// Props for the login button component
export interface LoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

// Props for handling form errors
export interface FormErrorProps {
  message?: string;
}

// Props for handling form success messages
export interface FormSuccessProps {
  message?: string;
}

// Props for the movie page
export interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}
export interface ChangeAuthDetailsProps {
  isChangingEmail: boolean;
  isChangingPassword: boolean;
  setIsChangingEmail: (value: boolean) => void;
  setIsChangingPassword: (value: boolean) => void;
}
