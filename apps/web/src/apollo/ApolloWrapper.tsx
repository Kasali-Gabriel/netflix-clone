'use client';

import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support';

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: 'http://localhost:3001/graphql',
    fetchOptions: { cache: 'no-store' },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
};

export const ApolloWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <ApolloNextAppProvider makeClient={makeClient}>
    {children}
  </ApolloNextAppProvider>
);
