import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateSubscriptionInput {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  planName: string;

  @Field()
  @IsString()
  price: string;

  @Field()
  @IsString()
  videoQuality: string;

  @Field()
  @IsString()
  priceId: string;
}
