import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { Metadata } from 'next';
import React from 'react';
import { ApolloWrapper } from '../apollo/ApolloWrapper';
import { UserProvider } from '../context/UserContext';
import ReduxProvider from '../Redux/reduxProvider';
import './globals.css';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Netflix Clone',
  description:
    'A fully functional clone of popular movie streaming website Netflix.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <ReduxProvider>
            <UserProvider>{children}</UserProvider>{' '}
          </ReduxProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
