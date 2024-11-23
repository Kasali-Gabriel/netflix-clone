import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsString } from 'class-validator';

@InputType()
export class UpdateUserSubscriptionInput {
  @Field({ nullable: true })
  @IsString()
  userId?: string;

  @Field({ nullable: true })
  @IsString()
  action?: string;

  @Field({ nullable: true })
  @IsString()
  stripeSubscriptionId?: string;

  @Field({ nullable: true })
  @IsString()
  stripePriceId?: string;

  @Field({ nullable: true })
  @IsString()
  priceId?: string;

  @Field({ nullable: true })
  @IsDate()
  stripeCurrentPeriodEnd?: Date;

  @Field({ nullable: true })
  @IsString()
  videoQuality?: string;

  @Field({ nullable: true })
  @IsString()
  planPrice?: string;

  @Field({ nullable: true })
  @IsString()
  planName?: string;

  @Field({ nullable: true })
  @IsString()
  status?: string;

  @Field({ nullable: true })
  @IsBoolean()
  cancelAtCurrentPeriodEnd?: boolean;
}
