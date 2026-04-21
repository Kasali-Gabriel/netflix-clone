import { gql } from '@apollo/client';

// --- USER / PROFILE (unchanged: still String IDs) ---
export const GET_PROFILE = gql`
  query GetProfile($id: String!) {
    getProfile(id: $id) {
      id
      name
      imageSrc
    }
  }
`;

export const GET_PROFILES = gql`
  query GetProfiles($userId: String!) {
    getProfiles(userId: $userId) {
      id
      name
      imageSrc
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      email
    }
  }
`;

export const CHECK_SUBSCRIPTION = gql`
  query CheckSubscription($userId: String!) {
    checkSubscription(userId: $userId)
  }
`;

export const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription($userId: String!) {
    getUserSubscription(userId: $userId) {
      id
      planName
      planPrice
      stripeSubscriptionId
      cancelAtCurrentPeriodEnd
      stripeCurrentPeriodEnd
      stripeCustomerId
    }
  }
`;

export const GET_PAYMENT_METHOD_DETAILS = gql`
  query GetPaymentMethodDetails($customerId: String!) {
    getPaymentMethodDetails(customerId: $customerId) {
      brand
      last4
    }
  }
`;

// --- LIKED MOVIES (FIXED: movieId should be Int) ---
export const GET_LIKED_MOVIE = gql`
  query GetLikedMovie($profileId: String!, $movieId: Int!) {
    getLikedMovie(profileId: $profileId, movieId: $movieId) {
      movieId
    }
  }
`;

export const GET_LIKED_MOVIES = gql`
  query GetLikedMovies($profileId: String!) {
    getLikedMovies(profileId: $profileId) {
      movieId
      movieTitle
      movieReleaseDate
      moviePosterPath
    }
  }
`;

// --- TMDB QUERIES (ALL IDs MUST BE Int) ---
export const GET_MOVIE_VIDEOS = gql`
  query GetMovieVideos($id: Int!) {
    getMovieVideos(id: $id)
  }
`;

export const GET_MOVIE_DETAILS = gql`
  query GetMovieDetails($id: Int!) {
    getMovieDetails(id: $id)
  }
`;

export const GET_SIMILAR_MOVIES = gql`
  query GetSimilarMovies($id: Int!) {
    getSimilarMovies(id: $id)
  }
`;

export const GET_RECOMMENDATIONS = gql`
  query GetRecommendations($id: Int!) {
    getRecommendations(id: $id)
  }
`;

export const GET_MOVIE_CERTIFICATION = gql`
  query GetMovieCertification($id: Int!) {
    getMovieCertification(id: $id)
  }
`;

export const GET_CREDITS = gql`
  query GetCredits($id: Int!) {
    getCredits(id: $id)
  }
`;

// --- COLLECTION QUERIES (no change) ---
export const GET_GENRES = gql`
  query GetGenres {
    getGenres
  }
`;

export const GET_UPCOMING_MOVIES = gql`
  query GetUpcomingMovies {
    getUpcomingMovies
  }
`;

export const GET_TOP_RATED_MOVIES = gql`
  query GetTopRatedMovies {
    getTopRatedMovies
  }
`;

export const GET_POPULAR_MOVIES = gql`
  query GetPopularMovies {
    getPopularMovies
  }
`;

export const GET_NOW_PLAYING_MOVIES = gql`
  query GetNowPlayingMovies {
    getNowPlayingMovies
  }
`;

// --- DISCOVER (mixed types are fine) ---
export const GET_DISCOVER_GENRE = gql`
  query GetDiscoverGenre($id: Int, $keywords: String, $page: Int) {
    getDiscoverGenre(id: $id, keywords: $keywords, page: $page)
  }
`;

// --- SEARCH ---
export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!) {
    searchMovies(query: $query)
  }
`;
