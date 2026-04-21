'use client';

import { getImagePath } from '@/lib/utils';
import { Movie } from '@/types/Movie';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import MyList from '../Buttons/MyList';
import { Button } from '../ui/button';

Autoplay.globalOptions = { delay: 8000 };

const Carouselbanner = ({ movies }: { movies: Movie[] }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 100 }, [
    Autoplay(),
  ]);

  return (
    <div className="relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {movies.map((movie) => {
          const imagePath =
            movie.backdrop_path ?? movie.poster_path ?? undefined;

          return (
            <div key={movie.id} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={getImagePath(imagePath)}
                alt={movie.title}
                width={1920}
                height={1080}
                className="h-[60vh] w-screen md:h-[70vh] xl:h-screen"
                priority
              />

              <div className="absolute left-0 top-0 z-30 h-full w-full bg-transparent bg-gradient-to-r from-black/90 via-black/25 to-transparent text-white">
                <div className="absolute bottom-10 space-y-3 p-4 md:space-y-5 md:p-10">
                  <h2 className="max-w-[70vw] text-xl font-bold md:text-3xl">
                    {movie.title}
                  </h2>

                  <p className="line-clamp-3 max-w-[50vw] text-sm md:text-lg">
                    {movie.overview}
                  </p>

                  <div className="flex flex-row justify-start gap-2">
                    <Link href={`/movie/${movie.id}?gmovie=${movie.title}`}>
                      <Button className="bg-white px-7 text-lg text-black transition-all duration-100 hover:bg-gray-200 sm:hover:scale-105 md:text-xl">
                        <FontAwesomeIcon icon={faPlay} className="mr-1" />
                        Watch
                      </Button>
                    </Link>

                    <MyList movie={movie} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carouselbanner;
