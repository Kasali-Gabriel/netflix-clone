import { useMutation, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  ADD_MOVIE_TO_LIST,
  REMOVE_MOVIE_FROM_LIST,
} from '../graphql/mutations';
import { GET_LIKED_MOVIE } from '../graphql/queries';
import { Movie } from '../types/Movie';

export const useLikeMovie = (movie: Movie) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const profileId = Cookies.get('profileId');

  const movieId = movie?.id.toString();

  const movieTitle = movie.title;
  const movieReleaseDate = movie.release_date;
  const moviePosterPath = movie.poster_path;

  const { loading } = useQuery(GET_LIKED_MOVIE, {
    variables: { profileId: profileId, movieId: movieId },
    onCompleted: (data) => {
      if (data && data.getLikedMovie) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    },
  });

  const [addMovieToList] = useMutation(ADD_MOVIE_TO_LIST, {
    onCompleted: (data) => {
      if (data?.addMovieToList) {
        setIsLiked(true);
      }
    },
  });

  const [removeMovieFromList] = useMutation(REMOVE_MOVIE_FROM_LIST, {
    onCompleted: (data) => {
      if (data?.removeMovieFromList) {
        setIsLiked(false);
      }
    },
  });

  const toggleLikedMovie = async () => {
    if (isLiked) {
      await removeMovieFromList({
        variables: { profileId: profileId, movieId: movieId },
      });
    } else {
      await addMovieToList({
        variables: {
          myListInput: {
            profileId,
            movieId,
            movieTitle,
            movieReleaseDate,
            moviePosterPath,
          },
        },
      });
    }
  };

  return { toggleLikedMovie, isLiked, loading };
};
