import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class ProfileInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  imageSrc: string;

  @Field()
  @IsUUID()
  userId: string;
}
