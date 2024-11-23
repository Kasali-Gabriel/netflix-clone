import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserSubscription {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  stripeCustomerId: string;

  @Field()
  stripeSubscriptionId: string;

  @Field()
  stripePriceId: string;

  @Field()
  stripeCurrentPeriodEnd?: Date;

  @Field()
  videoQuality: string;

  @Field()
  planPrice: string;

  @Field()
  planName: string;

  @Field()
  status: string;

  @Field()
  cancelAtCurrentPeriodEnd: boolean;
}

@ObjectType()
export class Subscription {
  @Field()
  id: string;

  @Field()
  status: string;

  @Field()
  planName: string;

  @Field()
  price: string;

  @Field()
  videoQuality: string;

  @Field()
  priceId: string;
}
