// Genre type
export interface Genre {
  id: number;
  name: string;
}

// Type for multiple genres
export interface Genres {
  genres: Genre[];
}

// Movie type definition
export interface Movie {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string;
  release_date?: string;
  title: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

// Props for a movie carousel component
export interface MovieCarouselProps {
  title?: string;
  movies: Movie[];
  isVertical?: boolean;
}

// Props for individual movie card component
export interface MovieCardProps {
  movie: Movie;
  isVertical?: boolean;
}

// Props for the carousel banner
export interface CarouselBannerProps {
  id?: string;
  keywords?: string;
}

export interface MovieDetailsProps {
  movie: any;
  maturityRating: string;
  credits: any;
}

export interface SearchInputProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  setIsSheetOpen: (show: boolean) => void;
}

export interface GenreDropdownProps {
  showBackground: boolean;
  isHome: boolean;
  setIsSheetOpen: (arg0: boolean) => void;
  isSheetOpen?: boolean;
}
