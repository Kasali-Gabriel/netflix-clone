import MovieDetails from '../../../../components/MovieComponents/MovieDetails';
import MoviesCarousel from '../../../../components/MovieComponents/MoviesCarousel';
import {
  getCredits,
  getMovieCertification,
  getMovieDetails,
  getMovieVideos,
  getRecommendations,
  getSimilarMovies,
} from '../../../../lib/movieFetcher';
import { MoviePageProps } from '../../../../types';
getCredits;

const page = async ({ params: { id } }: MoviePageProps) => {
  const movie = await getMovieDetails(id);

  const similarMovies = await getSimilarMovies(id);
  const recommendations = await getRecommendations(id);
  const maturityRating = await getMovieCertification(id);
  const credits = await getCredits(id);

  const videoUrl = await getMovieVideos(id); // Fetch the trailer URL

  return (
    <div className="flex flex-col p-2 py-10 sm:p-5 xl:pl-10 ">
      <div className="flex w-full flex-col pt-[40px] sm:pt-[65px] xl:grid xl:grid-cols-[2fr_1fr] xl:gap-10 xl:pt-[95px]">
        <div className="flex w-full">
          {videoUrl && (
            <iframe
              src={videoUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-[350px] w-full items-center justify-center sm:h-[400px] xl:h-[550px]"
            ></iframe>
          )}
        </div>

        <MovieDetails
          movie={movie}
          maturityRating={maturityRating}
          credits={credits}
        />

        <div className="mt-5 flex flex-col items-center  justify-center space-y-5 xl:hidden">
          {recommendations.length !== 0 && (
            <MoviesCarousel
              movies={recommendations}
              title="Recommended Movies"
            />
          )}

          {similarMovies.length !== 0 && (
            <MoviesCarousel movies={similarMovies} title="Similar Movies" />
          )}
        </div>
      </div>

      <div className="mt-20 hidden space-y-5 xl:-ml-7 xl:flex xl:flex-col xl:items-center xl:justify-start">
        {recommendations.length !== 0 && (
          <MoviesCarousel movies={recommendations} title="Recommended Movies" />
        )}

        {similarMovies.length !== 0 && (
          <MoviesCarousel movies={similarMovies} title="Similar Movies" />
        )}
      </div>
    </div>
  );
};

export default page;
