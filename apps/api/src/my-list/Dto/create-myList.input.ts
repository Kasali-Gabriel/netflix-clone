import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class MyListInput {
  @Field()
  @IsString()
  profileId: string;

  @Field()
  @IsString()
  movieId: string;

  @Field()
  @IsString()
  movieTitle: string;

  @Field()
  @IsString()
  movieReleaseDate: string;

  @Field()
  @IsString()
  moviePosterPath: string;
}
