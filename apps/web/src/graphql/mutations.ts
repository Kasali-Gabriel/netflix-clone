import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($createUserInput: CreateUserInput!) {
    registerUser(createUserInput: $createUserInput) {
      id
    }
  }
`;

export const USER_LOGIN = gql`
  mutation UserLogin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      id
      email
      accessToken
      refreshToken
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CreateProfile($profileInput: ProfileInput!) {
    createProfile(profileInput: $profileInput) {
      id
      userId
      name
      imageSrc
    }
  }
`;

export const RENAME_PROFILE = gql`
  mutation RenameProfile($id: String!, $name: String!) {
    renameProfile(id: $id, name: $name) {
      id
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: String!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

export const ADD_MOVIE_TO_LIST = gql`
  mutation AddMovieToList($myListInput: MyListInput!) {
    addMovieToList(myListInput: $myListInput) {
      id
    }
  }
`;

export const REMOVE_MOVIE_FROM_LIST = gql`
  mutation RemoveMovieFromList($profileId: String!, $movieId: String!) {
    removeMovieFromList(profileId: $profileId, movieId: $movieId) {
      id
    }
  }
`;

export const CHANGE_USER_EMAIL = gql`
  mutation ChangeUserEmail($userId: String!, $newEmail: String!) {
    changeUserEmail(userId: $userId, newEmail: $newEmail) {
      id
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation ChangeUserPassword($updatePasswordInput: UpdatePasswordInput!) {
    changeUserPassword(updatePasswordInput: $updatePasswordInput) {
      id
    }
  }
`;

export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription(
    $createSubscriptionInput: CreateSubscriptionInput!
  ) {
    createSubscription(createSubscriptionInput: $createSubscriptionInput)
  }
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription(
    $updateUserSubscriptionInput: UpdateUserSubscriptionInput!
  ) {
    updateSubscription(
      updateUserSubscriptionInput: $updateUserSubscriptionInput
    )
  }
`;
