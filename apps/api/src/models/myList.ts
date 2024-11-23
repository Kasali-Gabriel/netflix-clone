import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MyList {
  @Field()
  id: string;

  @Field()
  profileId: string;

  @Field()
  movieId: string;

  @Field()
  movieTitle: string;

  @Field()
  movieReleaseDate: string;

  @Field()
  moviePosterPath: string;
}
