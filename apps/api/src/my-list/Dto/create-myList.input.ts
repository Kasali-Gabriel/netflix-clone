import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class MyListInput {
  @Field()
  @IsString()
  profileId: string;

  @Field()
  @IsInt()
  movieId: number;

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
