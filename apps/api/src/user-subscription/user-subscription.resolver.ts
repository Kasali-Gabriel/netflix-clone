import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserSubscription } from 'src/models/userSubscription';
import { CreateUserSubscriptionInput } from './dto/create-subscription.input';
import { UpdateUserSubscriptionInput } from './dto/update-subscription.input';
import { UserSubscriptionService } from './user-subscription.service';

@Resolver(() => UserSubscription)
export class UserSubscriptionResolver {
  constructor(
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {}

  @Mutation(() => UserSubscription)
  async createUserSubscription(
    @Args('createUserSubscriptionInput')
    createUserSubscriptionInput: CreateUserSubscriptionInput,
  ) {
    return this.userSubscriptionService.createUserSubscription(
      createUserSubscriptionInput,
    );
  }

  @Query(() => UserSubscription)
  async getUserSubscription(@Args('userId') userId: string) {
    const subscription =
      await this.userSubscriptionService.getUserSubscription(userId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return subscription;
  }

  @Mutation(() => UserSubscription)
  async updateUserSubscription(
    @Args('updateSubscriptionInput')
    updateSubscriptionInput: UpdateUserSubscriptionInput,
  ) {
    return this.userSubscriptionService.updateUserSubscription(
      updateSubscriptionInput,
    );
  }

  @Query(() => Boolean)
  async checkSubscription(@Args('userId') userId: string) {
    return this.userSubscriptionService.checkSubscription(userId);
  }
}
