import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
  query GetProfile($id: String!) {
    getProfile(id: $id) {
      id
      name
      imageSrc
    }
  }
`;

export const GET_PROFILES = gql`
  query GetProfiles($userId: String!) {
    getProfiles(userId: $userId) {
      id
      name
      imageSrc
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
    }
  }
`;

export const GET_LIKED_MOVIE = gql`
  query GetLikedMovie($profileId: String!, $movieId: String!) {
    getLikedMovie(profileId: $profileId, movieId: $movieId) {
      movieId
    }
  }
`;

export const GET_LIKED_MOVIES = gql`
  query GetLikedMovies($profileId: String!) {
    getLikedMovies(profileId: $profileId) {
      movieId
      movieTitle
      movieReleaseDate
      moviePosterPath
    }
  }
`;

export const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription($userId: String!) {
    getUserSubscription(userId: $userId) {
      id
      planName
      planPrice
      stripeSubscriptionId
      cancelAtCurrentPeriodEnd
      stripeCurrentPeriodEnd
      stripeCustomerId
    }
  }
`;

export const GET_PAYMENT_METHOD_DETAILS = gql`
  query GetPaymentMethodDetails($customerId: String!) {
    getPaymentMethodDetails(customerId: $customerId) {
      brand
      last4
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      email
    }
  }
`;

export const CHECK_SUBSCRIPTION = gql`
  query CheckSubscription($userId: String!) {
    checkSubscription(userId: $userId)
  }
`;


