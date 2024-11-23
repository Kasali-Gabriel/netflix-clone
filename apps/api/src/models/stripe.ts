import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethodDetails {
  @Field()
  brand: string;

  @Field()
  last4: string;

  @Field()
  exp_month: number;

  @Field()
  exp_year: number;
}
