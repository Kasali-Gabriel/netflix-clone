'use client';

import useChangePage from '@/hooks/useChangePage';
import { useTransition } from 'react';
import Loader from './ButtonLoader';
import { Button } from '../ui/button';

interface LoginButtonProps {
  className?: string;
}

const LoginButton = ({ className }: LoginButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const changePage = useChangePage();
  const onClick = () => {
    startTransition(() => {
      changePage('/SignIn');
    });
  };

  return (
    <Button onClick={onClick} disabled={isPending} className={className}>
      {isPending ? <Loader /> : 'Sign In'}
    </Button>
  );
};

export default LoginButton;
