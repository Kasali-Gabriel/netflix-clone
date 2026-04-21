// lib/apollo-client.ts
'use client';

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function makeApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      fetchOptions: { cache: 'no-store' },
    }),
    cache: new InMemoryCache(),
  });
}
