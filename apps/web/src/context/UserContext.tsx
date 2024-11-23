'use client';

import { createContext, useEffect, useState } from 'react';
import { getSession } from '../lib/session';

export const UserContext = createContext<{
  user: { id: string; email: string } | null;
  setUser: (user: { id: string; email: string } | null) => void;
}>({
  user: null,
  setUser: () => {},
});

import { ReactNode } from 'react';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
