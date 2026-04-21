import { Profile } from './Profile';

// Search page
export interface SearchPageProps {
  params: {
    term: string;
  };
}

// Genre page
export interface GenrePageProps {
  params: {
    id: string; 
  };
  searchParams: {
    genre?: string;
  };
}

// Movie page
export interface MoviePageProps {
  params: {
    id: string; 
  };
}

// Navbar
export interface NavBarProps {
  showBackground: boolean;
  isHome: boolean;
  profile: Profile;
  profiles: Profile[];
  refreshProfiles: () => Promise<void>;
  isLoading: boolean;
  userId: string;
}

// Home rows
export interface HomeScreenRowsProps {
  h1: string;
  h2: string;
  imageSrc: string;
  isReversed?: boolean;
}

// Disclosures
export interface DisclosuresProps {
  title: string;
  children: string;
}

// Auth UI
export interface LoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

export interface FormErrorProps {
  message?: string;
}

export interface FormSuccessProps {
  message?: string;
}

export interface ChangeAuthDetailsProps {
  isChangingEmail: boolean;
  isChangingPassword: boolean;
  setIsChangingEmail: (value: boolean) => void;
  setIsChangingPassword: (value: boolean) => void;
}
