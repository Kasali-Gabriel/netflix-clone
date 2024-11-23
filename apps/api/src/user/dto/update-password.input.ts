import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class UpdatePasswordInput {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  oldPassword: string;

  @Field()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @Field()
  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
