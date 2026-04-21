// -----------------------------
// CORE DOMAIN TYPES
// -----------------------------

export interface Genre {
  id: number;
  name: string;
}

export interface GenresResponse {
  genres: Genre[];
}

// -----------------------------
// MOVIE TYPES (TMDB-aligned)
// -----------------------------

export interface Movie {
  id: number;
  title: string;
  adult?: boolean;
  backdrop_path?: string | null;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  release_date?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

// TMDB paginated response
export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// -----------------------------
// VIDEOS
// -----------------------------

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette' | string;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}

// -----------------------------
// CREDITS
// -----------------------------

export interface Cast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

// Processed credits (what you actually return)
export interface ProcessedCredits {
  Director: string[];
  Writer: string[];
  castNames: string[];
}

// -----------------------------
// MOVIE DETAILS
// -----------------------------

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;
  status?: string;
  tagline?: string;
  production_companies?: { name: string }[];
  production_countries?: { name: string }[];
}

// -----------------------------
// UI COMPONENT PROPS
// -----------------------------

export interface MovieCarouselProps {
  title?: string;
  movies: Movie[];
  isVertical?: boolean;
}

export interface MovieCardProps {
  movie: Movie;
  isVertical?: boolean;
}

export interface CarouselBannerProps {
  id?: number;
  keywords?: string;
}

export interface MovieDetailsProps {
  movie: MovieDetails;
  maturityRating: string | null;
  credits: ProcessedCredits;
}

export interface SearchInputProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  setIsSheetOpen: (show: boolean) => void;
}

export interface GenreDropdownProps {
  showBackground: boolean;
  isHome: boolean;
  isSheetOpen?: boolean;
  setIsSheetOpen: (open: boolean) => void;
}

// -----------------------------
// PAGINATION
// -----------------------------

export interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}
