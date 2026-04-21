'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import PaginationSection from '@/components/Filters/Pagination';
import MoviesCarousel from '@/components/Movies/MoviesCarousel';
import { getDiscoverGenre } from '@/lib/movieFetcher';
import { Movie } from '@/types/Movie';
import { FadeLoader } from 'react-spinners';

const GenrePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawId = params.id;
  const id = Number(rawId);

  const genre = searchParams.get('genre') ?? '';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // restore page
  useEffect(() => {
    const saved = sessionStorage.getItem(`currentPage-${id}`);
    if (saved) setCurrentPage(Number(saved));
  }, [id]);

  // persist page
  useEffect(() => {
    sessionStorage.setItem(`currentPage-${id}`, String(currentPage));
  }, [currentPage, id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!Number.isFinite(id)) return;

      setLoading(true);

      try {
        // IMPORTANT: send NUMBER if backend expects Float/Int
        const data = await getDiscoverGenre(id, '', currentPage);

        // guard against bad shapes
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error('Genre fetch failed:', err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <h1 className="px-4 text-2xl font-semibold sm:text-3xl md:text-5xl">
        {decodeURIComponent(genre)}
      </h1>

      <MoviesCarousel movies={movies} isVertical />

      <PaginationSection
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default GenrePage;
