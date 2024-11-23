'use client';

import Image from 'next/image';
import LoginButton from '../components/Buttons/LoginButton';
import Footer from '../components/Footer/Footer';
import CallToAction from '../components/Inputs/CallToAction';
import Faq from '../components/LandingPageInfo/Faq';
import HomeScreenRows from '../components/LandingPageInfo/HomeScreenRows';

const Home = () => {
  return (
    <div className="mx-auto flex flex-col">
      <div
        className="relative flex h-screen flex-col bg-cover bg-center md:h-[50vh] xl:h-screen 2xl:h-[60vh]"
        style={{ backgroundImage: "url('/background-image.png')" }}
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 z-10 bg-black bg-opacity-40" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-black/90 to-transparent" />

        <div className="z-20 flex flex-col 2xl:px-52">
          {/* NavBar */}
          <div className="mt-4 flex flex-row justify-between px-5 md:px-7 xl:px-40">
            <Image
              src="/logo.png"
              alt="logo"
              width={200}
              height={80}
              className="w-24 object-contain lg:-mt-3 lg:w-40"
            />

            <LoginButton className="mr-1 mt-2 h-8 w-20 rounded-md bg-[#CC0000] p-2 text-lg font-bold text-white hover:bg-[#990000] lg:mt-3" />
          </div>

          {/* Hero text */}
          <div className="mt-10 flex flex-col items-center justify-center p-3 sm:mt-28 lg:mt-44">
            <h1 className="mb-4 px-1 text-center text-[33px] font-bold leading-tight text-white lg:text-5xl">
              Unlimited movies, Tv shows, and more
            </h1>
            <p className="text-center text-xl font-semibold text-white lg:text-2xl">
              Watch anywhere. Cancel anytime.
            </p>
          </div>

          <CallToAction />
        </div>
      </div>

      {/* Rows */}
      <div>
        <HomeScreenRows
          h1="Enjoy on your TV"
          h2="Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more."
          imageSrc="/tv.png"
        />
        <HomeScreenRows
          h1="Download your shows to watch offline"
          h2="Save your favorites easily and always have something to watch."
          imageSrc="/download.png"
          isReversed
        />
        <HomeScreenRows
          h1="Create profiles for kids"
          h2="Send kids on adventures with their favorite characters in a space made just for them—free with your membership."
          imageSrc="/kids.png"
        />
      </div>

      {/* FAQ */}
      <div className="w-full border-y-8 border-stone-800 bg-black pb-10">
        <h1 className="mt-10 px-3 text-center text-4xl font-bold text-white lg:mt-14 lg:text-5xl xl:text-6xl">
          Frequently Asked Questions
        </h1>

        <div className="mb-10">
          <Faq />
        </div>

        <CallToAction />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
