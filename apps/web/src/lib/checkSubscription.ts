import { getClient } from '../apollo/ApolloClient';
import { CHECK_SUBSCRIPTION } from '../graphql/queries';

export async function checkSubscription(userId: string): Promise<boolean> {
  const { data } = await getClient().query({
    query: CHECK_SUBSCRIPTION,
    variables: { userId },
    fetchPolicy: 'network-only',
  });
  return data.checkSubscription;
}
