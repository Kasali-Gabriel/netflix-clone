'use client';

import React, { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from '../components/Theme/ThemeProvider';
import { UserProvider } from '../context/UserContext';
import ReduxProvider from '../Redux/reduxProvider';
import { makeApolloClient } from '@/apollo/ApolloWrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => makeApolloClient(), []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ApolloProvider client={client}>
        <ReduxProvider>
          <UserProvider>{children}</UserProvider>
        </ReduxProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
