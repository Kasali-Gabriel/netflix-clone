import { useMutation, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

import {
  ADD_MOVIE_TO_LIST,
  REMOVE_MOVIE_FROM_LIST,
} from '../graphql/mutations';

import { GET_LIKED_MOVIE, GET_LIKED_MOVIES } from '../graphql/queries';

import { useMemo } from 'react';
import { Movie } from '../types/Movie';

export const useMyList = (movie?: Movie) => {
  const profileId = Cookies.get('profileId')!;

  const movieId = movie?.id;
  const movieTitle = movie?.title;
  const movieReleaseDate = movie?.release_date;
  const moviePosterPath = movie?.poster_path;

  // -----------------------
  // LIST QUERY
  // -----------------------
  const {
    data: listData,
    loading: listLoading,
    refetch: refetchList,
  } = useQuery(GET_LIKED_MOVIES, {
    variables: { profileId },
    skip: !profileId,
  });

  // -----------------------
  // SINGLE MOVIE CHECK
  // -----------------------
  const {
    data: singleData,
    loading: singleLoading,
    refetch: refetchSingle,
  } = useQuery(GET_LIKED_MOVIE, {
    variables: {
      profileId,
      movieId,
    },
    skip: !movieId,
  });

  // -----------------------
  // MUTATIONS
  // -----------------------
  const [addMovieToList] = useMutation(ADD_MOVIE_TO_LIST);
  const [removeMovieFromList] = useMutation(REMOVE_MOVIE_FROM_LIST);

  // -----------------------
  // TOGGLE (refetch INSIDE here)
  // -----------------------
  const toggleLikedMovie = async () => {
    if (!movieId) return;

    const isLiked = !!singleData?.getLikedMovie;

    if (isLiked) {
      await removeMovieFromList({
        variables: { profileId, movieId },
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

    // 🔥 single source of truth refresh
    await Promise.all([refetchList(), refetchSingle()]);
  };

  // -----------------------
  // FORMATTED LIST
  // -----------------------

  const movies = useMemo(() => {
    return (
      listData?.getLikedMovies?.map((movie: any) => ({
        id: movie.movieId,
        title: movie.movieTitle,
        release_date: movie.movieReleaseDate,
        poster_path: movie.moviePosterPath,
      })) || []
    );
  }, [listData?.getLikedMovies]);

  return {
    movies,
    loading: listLoading || singleLoading,
    isLiked: !!singleData?.getLikedMovie,
    toggleLikedMovie,
  };
};
