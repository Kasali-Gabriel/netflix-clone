'use client';

import { useQuery } from '@apollo/client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GET_LIKED_MOVIES } from '../../graphql/queries';
import { Movie } from '../../types/Movie';
import MoviesCarousel from './MoviesCarousel';

let refetchLikedMovies: () => void;

interface LikedMoviesProps {
  profileId: string;
  popularMovies?: Movie[];
}

const LikedMovies = ({ profileId, popularMovies }: LikedMoviesProps) => {
  const [likedMovies, setLikedMovies] = useState<any[]>([]);

  const pathName = usePathname();

  const { data, refetch } = useQuery(GET_LIKED_MOVIES, {
    variables: { profileId },
  });

  useEffect(() => {
    refetchLikedMovies = refetch;
  }, [refetch]);

  useEffect(() => {
    if (!data) return;

    const formattedLikedMovies = data.getLikedMovies.map((movie: any) => ({
      id: movie.movieId,
      title: movie.movieTitle,
      release_date: movie.movieReleaseDate,
      poster_path: movie.moviePosterPath,
    }));

    setLikedMovies(formattedLikedMovies);
  }, [data]);

  return (
    <div>
      {likedMovies.length > 0 && (
        <>
          {pathName === '/MyList' && (
            <h1 className="w-full px-4 text-left font-mono text-2xl font-semibold sm:text-3xl md:text-5xl">
              Favourite movies
            </h1>
          )}
          <MoviesCarousel
            movies={likedMovies}
            title={pathName === '/MyList' ? '' : 'Liked Movies'}
            isVertical={pathName === '/MyList' ? true : false}
          />
        </>
      )}

      {likedMovies.length === 0 && pathName === '/MyList' && (
        <div>
          <p className="w-full px-4 text-left text-lg text-gray-500 sm:text-xl ">
            You haven&apos;t added any movie to your list yet.
          </p>

          <h2 className="xl:text:5xl mt-4 px-4 text-xl font-bold md:text-3xl">
            Recommended movies
          </h2>
          <MoviesCarousel movies={popularMovies || []} />
        </div>
      )}
    </div>
  );
};

export default LikedMovies;
export { refetchLikedMovies };
