import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentMethodDetails } from 'src/models/stripe';
import { Subscription } from 'src/models/userSubscription';
import { UpdateUserSubscriptionInput } from 'src/user-subscription/dto/update-subscription.input';
import { CreateSubscriptionInput } from './dto/create-stripe.input';
import { StripeService } from './stripe.service';

@Resolver(() => Subscription)
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Mutation(() => String)
  async createSubscription(
    @Args('createSubscriptionInput')
    createSubscriptionInput: CreateSubscriptionInput,
  ) {
    const result = await this.stripeService.createSubscription(
      createSubscriptionInput,
    );
    return result.url;
  }

  @Mutation(() => Boolean)
  async updateSubscription(
    @Args('updateUserSubscriptionInput')
    updateUserSubscriptionInput: UpdateUserSubscriptionInput,
  ) {
    await this.stripeService.updateSubscription(updateUserSubscriptionInput);
    return true;
  }

  @Query(() => PaymentMethodDetails, { nullable: true })
  async getPaymentMethodDetails(@Args('customerId') customerId: string) {
    const paymentMethodDetails =
      await this.stripeService.getPaymentMethodDetails(customerId);
    return paymentMethodDetails;
  }
}
