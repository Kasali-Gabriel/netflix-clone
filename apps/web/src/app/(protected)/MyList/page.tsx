import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LikedMovies from '../../../components/MovieComponents/LikedMovies';
import { getPopularMovies } from '../../../lib/movieFetcher';

export default async function MyListPage() {
  const cookieStore = cookies();
  const profileId = cookieStore.get('profileId')?.value;

  if (!profileId) {
    redirect('/SignIn');
  }

  const popularMovies = await getPopularMovies();

  return (
    <div className="pt-20 sm:pt-24 md:pt-32 lg:pt-28">
      <div className="flex flex-col items-center justify-center">
        <LikedMovies profileId={profileId} popularMovies={popularMovies} />
      </div>
    </div>
  );
}
