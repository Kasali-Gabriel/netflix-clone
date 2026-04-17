'use client';

import React from 'react';
import { ApolloWrapper } from '../apollo/ApolloWrapper';
import { ThemeProvider } from '../components/Theme/ThemeProvider';
import { UserProvider } from '../context/UserContext';
import ReduxProvider from '../Redux/reduxProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ApolloWrapper>
        <ReduxProvider>
          <UserProvider>{children}</UserProvider>
        </ReduxProvider>
      </ApolloWrapper>
    </ThemeProvider>
  );
}
