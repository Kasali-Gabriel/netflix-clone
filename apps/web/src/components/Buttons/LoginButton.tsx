'use client';

import { useTransition } from 'react';
import useChangePage from '../../hooks/useChangePage';
import { Button } from '../ui/button';
import Loader from './ButtonLoader';

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
