import { Movie } from '@/types/Movie';
import { getClient } from '../apollo/ApolloClient';
import {
  GET_CREDITS,
  GET_DISCOVER_GENRE,
  GET_GENRES,
  GET_MOVIE_CERTIFICATION,
  GET_MOVIE_DETAILS,
  GET_MOVIE_VIDEOS,
  GET_NOW_PLAYING_MOVIES,
  GET_POPULAR_MOVIES,
  GET_RECOMMENDATIONS,
  GET_SIMILAR_MOVIES,
  GET_TOP_RATED_MOVIES,
  GET_UPCOMING_MOVIES,
  SEARCH_MOVIES,
} from '../graphql/queries';

const apiCache: Record<string, { data: any; expiry: number }> = {};

// --------------------
// Movie Videos
// --------------------
export async function getMovieVideos(id: number): Promise<string | null> {
  const cacheKey = `movie_videos_${id}`;
  const now = Date.now();

  if (apiCache[cacheKey] && apiCache[cacheKey].expiry > now) {
    return apiCache[cacheKey].data;
  }

  try {
    const client = getClient();

    const { data } = await client.query({
      query: GET_MOVIE_VIDEOS,
      variables: { id },
    });

    const response = JSON.parse(data.getMovieVideos);
    if (!response) return null;

    const video = response.results?.find((v: { type: string }) =>
      ['Trailer', 'Teaser', 'Clip', 'Featurette'].includes(v.type),
    );

    const videoUrl = video
      ? `https://www.youtube.com/embed/${video.key}`
      : null;

    apiCache[cacheKey] = {
      data: videoUrl,
      expiry: now + 86400 * 1000,
    };

    return videoUrl;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// --------------------
// Filter Movies
// --------------------

async function filterMovies(
  movies: Movie[],
  type: 'nowPlaying' | 'others',
): Promise<Movie[]> {
  const results = await Promise.all(
    movies.map(async (movie) => {
      const videoUrl = await getMovieVideos(movie.id);

      if (type === 'nowPlaying') {
        return videoUrl && movie.backdrop_path ? movie : null;
      }

      return videoUrl && movie.poster_path ? movie : null;
    }),
  );

  return results.filter((movie): movie is Movie => movie !== null);
}

// --------------------
// Genres
// --------------------
export async function fetchMovies() {
  const client = getClient();

  const { data } = await client.query({
    query: GET_GENRES,
  });

  return JSON.parse(data.getGenres);
}

// --------------------
// Lists
// --------------------
export async function getUpcomingMovies() {
  const client = getClient();
  const { data } = await client.query({ query: GET_UPCOMING_MOVIES });

  const parsed = JSON.parse(data.getUpcomingMovies);
  return parsed ? filterMovies(parsed.results, 'others') : [];
}

export async function getTopRatedMovies() {
  const client = getClient();
  const { data } = await client.query({ query: GET_TOP_RATED_MOVIES });

  const parsed = JSON.parse(data.getTopRatedMovies);
  return parsed ? filterMovies(parsed.results, 'others') : [];
}

export async function getPopularMovies() {
  const client = getClient();
  const { data } = await client.query({ query: GET_POPULAR_MOVIES });

  const parsed = JSON.parse(data.getPopularMovies);
  return parsed ? filterMovies(parsed.results, 'others') : [];
}

// --------------------
// Discover
// --------------------
export async function getDiscoverGenre(
  id?: number,
  keywords?: string,
  page: number = 1,
) {
  const client = getClient();

  const { data } = await client.query({
    query: GET_DISCOVER_GENRE,
    variables: {
      id: id ?? null,
      keywords,
      page,
    },
  });

  const parsed = JSON.parse(data.getDiscoverGenre);
  return parsed ? filterMovies(parsed.results, 'others') : [];
}

// --------------------
// Movie Details
// --------------------
export async function getMovieDetails(id: number) {
  const client = getClient();

  const { data } = await client.query({
    query: GET_MOVIE_DETAILS,
    variables: { id },
  });

  return JSON.parse(data.getMovieDetails);
}

export async function getSimilarMovies(id: number) {
  const client = getClient();

  const { data } = await client.query({
    query: GET_SIMILAR_MOVIES,
    variables: { id },
  });

  const parsed = JSON.parse(data.getSimilarMovies);
  return parsed ? filterMovies(parsed.results, 'others') : [];
}

export async function getRecommendations(id: number) {
  const client = getClient();

  const { data } = await client.query({
    query: GET_RECOMMENDATIONS,
    variables: { id },
  });

  const parsed = JSON.parse(data.getRecommendations);
  return parsed ? filterMovies(parsed.results, 'others') : [];
}

// --------------------
// Certification
// --------------------
export async function getMovieCertification(id: number) {
  const client = getClient();

  const { data } = await client.query({
    query: GET_MOVIE_CERTIFICATION,
    variables: { id },
  });

  const parsed = JSON.parse(data.getMovieCertification);
  if (!parsed) return null;

  const usRelease = parsed.results?.find(
    (r: { iso_3166_1: string }) => r.iso_3166_1 === 'US',
  );

  return usRelease?.release_dates?.[0]?.certification || null;
}

// --------------------
// Credits
// --------------------
export async function getCredits(id: number) {
  const client = getClient();

  const { data } = await client.query({
    query: GET_CREDITS,
    variables: { id },
  });

  const parsed = JSON.parse(data.getCredits);
  if (!parsed) return { Director: [], Writer: [], castNames: [] };

  const Director =
    parsed.crew
      ?.filter((c: any) => c.job === 'Director')
      .map((d: any) => d.name) || [];

  const Writer =
    parsed.crew
      ?.filter((c: any) => c.job === 'Writer')
      .map((w: any) => w.name) || [];

  const castNames = parsed.cast?.map((c: any) => c.name) || [];

  return { Director, Writer, castNames };
}

// --------------------
// Now Playing
// --------------------
export async function NowPlaying() {
  const client = getClient();

  const { data } = await client.query({
    query: GET_NOW_PLAYING_MOVIES,
  });

  const parsed = JSON.parse(data.getNowPlayingMovies);
  if (!parsed) return [];

  const filtered = await filterMovies(parsed.results, 'nowPlaying');

  return filtered.sort(() => Math.random() - 0.5);
}

// --------------------
// Search
// --------------------
const searchMoviesCache: Record<string, { data: any; expiry: number }> = {};

export async function getSearchMovies(term: string) {
  const now = Date.now();

  if (searchMoviesCache[term]?.expiry > now) {
    return searchMoviesCache[term].data;
  }

  const client = getClient();

  const { data } = await client.query({
    query: SEARCH_MOVIES,
    variables: { query: term },
  });

  const parsed = JSON.parse(data.searchMovies);
  if (!parsed) return { fetchedMovies: [], totalPages: 0 };

  const filtered = await filterMovies(parsed.results, 'others');

  const pages: Movie[][] = [];

  for (let i = 0; i < filtered.length; i += 24) {
    pages.push(filtered.slice(i, i + 24));
  }

  const result = {
    fetchedMovies: pages,
    totalPages: pages.length,
  };

  searchMoviesCache[term] = {
    data: result,
    expiry: now + 86400 * 1000,
  };

  return result;
}
