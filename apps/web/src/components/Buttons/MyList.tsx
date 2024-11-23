'use client';

import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import { useLikeMovie } from '../../hooks/useLikeMovie';
import { Movie } from '../../types/Movie';
import { refetchLikedMovies } from '../MovieComponents/LikedMovies';
import { Button } from '../ui/button';
import Loader from './ButtonLoader';

const MyList = ({ movie }: { movie: Movie }) => {
  const pathname = usePathname();
  const moviePath = pathname.startsWith('/movie');

  const { toggleLikedMovie, isLiked, loading } = useLikeMovie(movie);

  return (
    <div>
      <Button
        className={`${moviePath ? 'w-full border-none hover:scale-105 sm:w-28 xl:w-full' : 'sm:hover:scale-110'} z-10 cursor-pointer bg-stone-500 pl-2 text-lg text-white transition-all duration-100 hover:bg-stone-600 md:text-xl`}
        onClick={() => {
          toggleLikedMovie();
          refetchLikedMovies();
        }}
      >
        {loading ? (
          <Loader size={17} />
        ) : (
          <FontAwesomeIcon
            icon={isLiked ? faCheck : faPlus}
            className="mx-2 text-xl"
          />
        )}
        My List
      </Button>
    </div>
  );
};

export default MyList;
