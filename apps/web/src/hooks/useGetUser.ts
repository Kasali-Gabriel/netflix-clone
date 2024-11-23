import { useEffect, useState } from 'react';
import { getSession } from '../lib/session';

const useUser = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUserId(session?.user.id || null);
      setEmail(session?.user.email || null);
    };

    fetchSession();
  }, []);

  const getUserId = () => userId;
  const getUserEmail = () => email;

  return { getUserId, getUserEmail };
};

export default useUser;
