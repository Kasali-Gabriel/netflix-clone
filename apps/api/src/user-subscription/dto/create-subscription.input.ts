import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString } from 'class-validator';

@InputType()
export class CreateUserSubscriptionInput {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  stripeCustomerId: string;

  @Field()
  @IsString()
  stripeSubscriptionId: string;

  @Field()
  @IsString()
  stripePriceId: string;

  @Field()
  @IsDate()
  stripeCurrentPeriodEnd?: Date;

  @Field()
  @IsString()
  videoQuality: string;

  @Field()
  @IsString()
  planPrice: string;

  @Field()
  @IsString()
  planName: string;

  @Field()
  @IsString()
  status: string;

  @Field()
  @IsBoolean()
  cancelAtCurrentPeriodEnd: boolean;
}
