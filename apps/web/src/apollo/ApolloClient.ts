import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql',
});

const noCacheLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    fetchOptions: {
      cache: 'no-store',
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([noCacheLink, httpLink]),
  cache: new InMemoryCache(),
});

export function getClient() {
  return client;
}
