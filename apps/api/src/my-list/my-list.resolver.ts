import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MyList } from 'src/models/myList';
import { MyListInput } from './Dto/create-myList.input';
import { MyListService } from './my-list.service';

@Resolver(() => MyList)
export class MyListResolver {
  constructor(private readonly myListService: MyListService) {}

  @Mutation(() => MyList)
  async addMovieToList(@Args('myListInput') myListInput: MyListInput) {
    return this.myListService.addMovieToList(myListInput);
  }

  @Mutation(() => MyList)
  async removeMovieFromList(
    @Args('profileId') profileId: string,
    @Args('movieId') movieId: string,
  ) {
    return await this.myListService.removeMovieFromList(profileId, movieId);
  }

  @Query(() => MyList, { nullable: true })
  async getLikedMovie(
    @Args('profileId') profileId: string,
    @Args('movieId') movieId: string,
  ) {
    const likedMovie = await this.myListService.getLikedMovie(
      profileId,
      movieId,
    );
    return likedMovie;
  }

  @Query(() => [MyList], { nullable: true })
  async getLikedMovies(@Args('profileId') profileId: string) {
    return this.myListService.getLikedMovies(profileId);
  }
}
