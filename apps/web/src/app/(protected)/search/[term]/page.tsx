'use client';

import PaginationSection from '@/components/Filters/Pagination';
import MoviesCarousel from '@/components/Movies/MoviesCarousel';
import { getPopularMovies, getSearchMovies } from '@/lib/movieFetcher';
import { Movie } from '@/types/Movie';
import { use, useEffect, useState } from 'react';
import { FadeLoader } from 'react-spinners';

type Params = {
  term: string;
};

type Props = {
  params: Promise<Params>;
};

const SearchPage = ({ params }: Props) => {
  const { term } = use(params); 
  
  const termToUse = decodeURI(term);

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`currentPage-${termToUse}`);
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        `currentPage-${termToUse}`,
        currentPage.toString(),
      );
    }
  }, [currentPage, termToUse]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      const { fetchedMovies, totalPages } = await getSearchMovies(termToUse);

      setTotalPages(totalPages);
      setMovies(
        (fetchedMovies[currentPage - 1] || []).filter(Boolean) as Movie[],
      );

      setLoading(false);
    };

    fetchMovies();
  }, [termToUse, currentPage]);

  useEffect(() => {
    const fetchPopular = async () => {
      const data = await getPopularMovies();
      setPopularMovies(data);
    };

    fetchPopular();
  }, []);

  if (loading) {
    return (
      <div className="mb-20 flex items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-28">
        <FadeLoader color="#d51b1b" height={25} />
      </div>
    );
  }

  return (
    <div className="mx-auto pt-20 sm:pt-24 md:pt-32 lg:pt-28">
      <h1 className="w-full px-4 text-left text-2xl sm:text-3xl md:text-5xl">
        results for <span className="font-bold italic">"{termToUse}"</span>
      </h1>

      <MoviesCarousel movies={movies} isVertical />

      {totalPages > 1 && (
        <PaginationSection
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      )}

      {movies.length === 0 && (
        <>
          <h2 className="xl:text:5xl px-6 text-xl font-bold md:text-3xl xl:px-10">
            Others you might like
          </h2>

          <MoviesCarousel movies={popularMovies} />
        </>
      )}
    </div>
  );
};

export default SearchPage;
