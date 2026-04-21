'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn, getImagePath } from '@/lib/utils';
import { MovieCardProps } from '@/types/Movie';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import MyList from '../Buttons/MyList';
import { Button } from '../ui/button';

const MovieCard = ({ movie, isVertical }: MovieCardProps) => {
  const imagePath = movie.backdrop_path ?? movie.poster_path ?? undefined;
  const releaseYear = movie.release_date?.slice(0, 4);

  const hasEnoughVotes = (movie.vote_count ?? 0) >= 100;

  const rating =
    typeof movie.vote_average === 'number'
      ? movie.vote_average.toFixed(1)
      : null;

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        <div className="w-full cursor-pointer">
          <div
            className={`transform ${
              isVertical ? 'grid' : 'flex flex-col items-center justify-center'
            }`}
          >
            <div
              className={cn(
                'mx-1 md:mx-2',
                !isVertical
                  ? 'w-[7.5rem] sm:w-32 md:w-44 lg:w-52 xl:w-96'
                  : 'w-auto',
              )}
            >
              <Image
                src={getImagePath(imagePath)}
                alt={movie.title}
                width={1920}
                height={1080}
                className="h-44 rounded-sm border border-neutral-400 object-cover object-center transition duration-200 ease-out hover:scale-105 md:h-64 lg:h-80 xl:h-64 dark:border-neutral-800"
              />

              <p
                className={cn(
                  !isVertical
                    ? 'mt-2 flex justify-center text-center'
                    : 'mb-5 mt-1 w-full text-center sm:mt-2',
                )}
              >
                {movie.title}
              </p>
            </div>
          </div>
        </div>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="sm:max-w-md space-y-3 rounded-xl p-5 max-w-[90vw]">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{movie.title}</h3>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {releaseYear && `${releaseYear} • `}⭐ {rating ?? 'N/A'}
            {rating && (
              <span className="ml-2 text-neutral-500">
                {hasEnoughVotes
                  ? '(Avg Rating)'
                  : `(Limited votes: ${movie.vote_count ?? 0})`}
              </span>
            )}
          </p>

          <p className="line-clamp-4 text-sm text-neutral-700 dark:text-neutral-300">
            {movie.overview || 'No description available.'}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            href={`/movie/${movie.id}?gmovie=${movie.title}`}
            className="flex-1"
          >
            <Button className="w-full border border-neutral-300 dark:border-none bg-white px-7 text-lg text-black transition-all duration-100 hover:bg-gray-200 sm:hover:scale-[1.02] md:text-xl">
              <FontAwesomeIcon icon={faPlay} className="mr-1" />
              Watch
            </Button>
          </Link>

          <MyList movie={movie} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieCard;
