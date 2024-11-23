'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { Movie, MovieCarouselProps } from '../../types/Movie';
import { Button } from '../ui/button';
import MovieCard from './MovieCard';

const MoviesCarousel = ({ title, movies, isVertical }: MovieCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (carouselRef.current) {
        setIsOverflow(
          carouselRef.current.scrollWidth > carouselRef.current.clientWidth,
        );
        setCanScrollRight(
          carouselRef.current.scrollWidth >
            carouselRef.current.clientWidth + carouselRef.current.scrollLeft,
        );
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [movies]);

  const handleScroll = () => {
    if (carouselRef.current) {
      setIsScrolled(carouselRef.current.scrollLeft > 0);
      setCanScrollRight(
        carouselRef.current.scrollWidth >
          carouselRef.current.clientWidth + carouselRef.current.scrollLeft,
      );
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const maxScrollLeft =
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const scrollAmount = carouselRef.current.clientWidth / 2;
      const newScrollLeft =
        direction === 'left'
          ? Math.max(carouselRef.current.scrollLeft - scrollAmount, 0)
          : Math.min(
              carouselRef.current.scrollLeft + scrollAmount,
              maxScrollLeft,
            );

      carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className={cn(isVertical ? 'w-full pl-2' : 'w-[96vw] ')}>
        <h2 className="mt-1 pl-4 text-xl font-bold sm:mt-3 md:pl-6 lg:mt-7 lg:text-3xl xl:mt-10">
          {title}
        </h2>
        <div className="relative flex items-center">
          {!isVertical && isOverflow && (
            <>
              {isScrolled && (
                <Button
                  className="dark:bg.white absolute left-4 z-10 hidden h-fit -translate-x-1/2 rounded-full bg-black bg-opacity-50 px-2 text-white sm:block xl:left-6 dark:text-black"
                  onClick={() => scroll('left')}
                >
                  <ChevronLeft size={32} strokeWidth={3} />
                </Button>
              )}
              {canScrollRight && (
                <Button
                  className="dark:bg.white absolute right-4 z-10 hidden h-fit translate-x-1/2 rounded-full bg-black bg-opacity-50 px-2 text-white sm:block dark:text-black"
                  onClick={() => scroll('right')}
                >
                  <ChevronRight size={32} strokeWidth={3} />
                </Button>
              )}
            </>
          )}
          <div
            ref={carouselRef}
            className={cn(
              isVertical
                ? 'grid grid-cols-3 pt-4 sm:grid-cols-5 sm:pt-2 md:grid-cols-4 xl:grid-cols-6 xl:pt-0'
                : 'scrollbar-hide mx-2 flex overflow-x-auto pt-2 xl:mx-4 xl:pt-4',
            )}
          >
            {movies?.map((movie: Movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} isVertical={isVertical} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviesCarousel;
