import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { TmdbService } from './tmdb.service';

@Resolver()
export class TmdbResolver {
  constructor(private readonly tmdbService: TmdbService) {}

  @Query(() => String)
  async getPopularMovies() {
    const data = await this.tmdbService.fetchFromTMDB('/movie/popular');
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getMovieDetails(@Args('id', { type: () => Int }) id: number) {
    const data = await this.tmdbService.fetchFromTMDB(`/movie/${id}`);
    return JSON.stringify(data);
  }

  @Query(() => String)
  async searchMovies(@Args('query') query: string) {
    const firstPageData = await this.tmdbService.fetchFromTMDB(
      '/search/movie',
      { query, page: '1' },
    );
    if (!firstPageData) return JSON.stringify({ results: [] });

    const totalPages = Math.min(firstPageData.total_pages, 40);

    const allPagesData = await Promise.all(
      Array.from({ length: totalPages }, (_, i) =>
        this.tmdbService.fetchFromTMDB('/search/movie', {
          query,
          page: (i + 1).toString(),
        }),
      ),
    );

    const allResults = allPagesData.flatMap((data) => data.results);
    return JSON.stringify({ ...firstPageData, results: allResults });
  }

  @Query(() => String)
  async getUpcomingMovies() {
    const data = await this.tmdbService.fetchFromTMDB('/movie/upcoming');
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getTopRatedMovies() {
    const data = await this.tmdbService.fetchFromTMDB('/movie/top_rated');
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getDiscoverGenre(
    @Args('id', { type: () => Int, nullable: true }) id?: number,
    @Args('keywords', { nullable: true }) keywords?: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number = 1,
  ) {
    const params: Record<string, string> = {};

    if (keywords) params.with_keywords = keywords;
    if (id) params.with_genres = id.toString();
    params.page = page.toString();

    const data = await this.tmdbService.fetchFromTMDB(
      '/discover/movie',
      params,
    );

    return JSON.stringify(data);
  }

  @Query(() => String)
  async getSimilarMovies(@Args('id', { type: () => Int }) id: number) {
    const data = await this.tmdbService.fetchFromTMDB(`/movie/${id}/similar`);
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getRecommendations(@Args('id', { type: () => Int }) id: number) {
    const data = await this.tmdbService.fetchFromTMDB(
      `/movie/${id}/recommendations`,
    );
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getMovieCertification(@Args('id', { type: () => Int }) id: number) {
    const data = await this.tmdbService.fetchFromTMDB(
      `/movie/${id}/release_dates`,
    );
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getCredits(@Args('id', { type: () => Int }) id: number) {
    const data = await this.tmdbService.fetchFromTMDB(`/movie/${id}/credits`, {
      language: 'en-US',
    });
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getNowPlayingMovies() {
    const data = await this.tmdbService.fetchFromTMDB('/movie/now_playing');
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getMovieVideos(@Args('id', { type: () => Int }) id: number) {
    const data = await this.tmdbService.fetchFromTMDB(`/movie/${id}/videos`, {
      language: 'en-US',
    });
    return JSON.stringify(data);
  }

  @Query(() => String)
  async getGenres() {
    const data = await this.tmdbService.fetchFromTMDB('/genre/movie/list', {
      language: 'en',
    });
    return JSON.stringify(data);
  }
}
