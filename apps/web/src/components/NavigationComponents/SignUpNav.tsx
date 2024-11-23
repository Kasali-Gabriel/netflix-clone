'use client';

import Image from 'next/image';
import { useContext } from 'react';
import useChangePage from '../../hooks/useChangePage';
import LoginButton from '../Buttons/LoginButton';
import SignOutBtn from '../Buttons/SignOutBtn';
import { UserContext } from '../../context/UserContext';

const SignUpNav = () => {
  const changePage = useChangePage();
  const { user } = useContext(UserContext);

  return (
    <div className="mx-2 flex flex-row items-center justify-between border-b border-gray-300 py-4 sm:mx-6">
      <button onClick={() => changePage('/')}>
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={80}
          className="w-24 cursor-pointer object-contain sm:w-44"
        />
      </button>

      {!user ? (
        <LoginButton className="mt-1 transform bg-transparent font-semibold text-black transition-all hover:bg-[#990000] hover:text-white sm:mt-6 sm:text-2xl lg:mt-8" />
      ) : (
        <div>
          <SignOutBtn />
        </div>
      )}
    </div>
  );
};

export default SignUpNav;
