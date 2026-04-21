'use client';

import { useMyList } from '@/hooks/useMyList';
import { getMovieDetails } from '@/lib/movieFetcher';
import { Movie } from '@/types/Movie';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FadeLoader } from 'react-spinners';
import MoviesCarousel from './MoviesCarousel';

interface LikedMoviesProps {
  popularMovies?: Movie[];
}

const LikedMovies = ({ popularMovies }: LikedMoviesProps) => {
  const pathName = usePathname();
  const { movies, loading } = useMyList();

  const [mounted, setMounted] = useState(false);
  const [fullMovies, setFullMovies] = useState<Movie[]>([]);
  const [hydrating, setHydrating] = useState(false);

  const cacheRef = useRef(new Map<number, Movie>());

  // ✅ mount guard prevents hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const hydrate = async () => {
      if (!movies?.length) {
        setFullMovies([]);
        return;
      }

      setHydrating(true);

      try {
        const results = await Promise.all(
          movies.map(async (m) => {
            const cached = cacheRef.current.get(m.id);
            if (cached) return cached;

            const movie = await getMovieDetails(m.id);
            cacheRef.current.set(m.id, movie);
            return movie;
          }),
        );

        setFullMovies(results.filter(Boolean));
      } finally {
        setHydrating(false);
      }
    };

    hydrate();
  }, [movies, mounted]);

  if (!mounted) return null;

  if (loading || hydrating) {
    return (
      <div className="mb-20 flex items-center justify-center pt-20">
        <FadeLoader color="#d51b1b" height={25} />
      </div>
    );
  }

  return (
    <div>
      {fullMovies.length > 0 && (
        <>
          {pathName === '/MyList' && (
            <h1 className="px-4 text-2xl font-semibold">Favourite movies</h1>
          )}

          <MoviesCarousel
            movies={fullMovies}
            isVertical={pathName === '/MyList'}
          />
        </>
      )}

      {fullMovies.length === 0 && pathName === '/MyList' && (
        <div>
          <p className="px-4 text-gray-500">
            You haven&apos;t added any movie to your list yet.
          </p>

          <h2 className="mt-4 px-4 text-xl font-bold">Recommended movies</h2>

          <MoviesCarousel movies={popularMovies || []} />
        </div>
      )}
    </div>
  );
};

export default LikedMovies;
