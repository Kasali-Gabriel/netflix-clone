export const dynamic = 'force-dynamic';

import CarouselBannerWrapper from '@/components/Carousel/CarouselBannerWrapper';
import LikedMovies from '@/components/Movies/LikedMovies';
import MoviesCarousel from '@/components/Movies/MoviesCarousel';
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from '@/lib/movieFetcher';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomeScreen() {
  const upComingMovies = await getUpcomingMovies();
  const topRatedMovies = await getTopRatedMovies();
  const popularMovies = await getPopularMovies();

  const cookieStore = await cookies();
  const profileId = cookieStore.get('profileId')?.value;

  if (!profileId) {
    redirect('/profiles');
  }

  return (
    <div>
      <CarouselBannerWrapper />

      <div className="flex flex-col space-y-2">
        <MoviesCarousel movies={upComingMovies} title="Upcoming" />
        <MoviesCarousel movies={topRatedMovies} title="Top Rated" />
        <MoviesCarousel movies={popularMovies} title="Popular" />

        <LikedMovies />
      </div>
    </div>
  );
}
