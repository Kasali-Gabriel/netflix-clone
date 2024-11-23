'use client';

import { useEffect, useState } from 'react';
import { FadeLoader } from 'react-spinners';
import PaginationSection from '../../../../components/Filters/Pagination';
import MoviesCarousel from '../../../../components/MovieComponents/MoviesCarousel';
import { getDiscoverGenre } from '../../../../lib/movieFetcher';
import { GenrePageProps } from '../../../../types';
import { Movie } from '../../../../types/Movie';

const GenrePage = ({
  params: { id },
  searchParams: { genre },
}: GenrePageProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const savedPage = sessionStorage.getItem(`currentPage-${id}`);
      return savedPage ? parseInt(savedPage, 10) : 1;
    }
    return 1;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(`currentPage-${id}`, currentPage.toString());
    }
  }, [currentPage, id]);

  const fetchMovies = async () => {
    setLoading(true);
    const fetchedMovies = await getDiscoverGenre(id, '', currentPage);

    setMovies(fetchedMovies);

    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="mb-20 flex items-center justify-center pt-20 sm:pt-24 md:pt-32 lg:pt-28">
        <FadeLoader color="#d51b1b" height={25} />
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 md:pt-32 lg:pt-28">
      <div className="flex flex-col">
        <h1 className="w-full px-4 text-left font-mono text-2xl font-semibold sm:text-3xl md:text-5xl">
          {genre}
        </h1>

        <MoviesCarousel movies={movies} isVertical />

        <PaginationSection
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default GenrePage;
