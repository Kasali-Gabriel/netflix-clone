import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserSubscriptionInput } from './dto/create-subscription.input';
import { UpdateUserSubscriptionInput } from './dto/update-subscription.input';

@Injectable()
export class UserSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserSubscription(
    createUserSubscriptionInput: CreateUserSubscriptionInput,
  ) {
    const subscriptionData = {
      id: uuidv4(),
      ...createUserSubscriptionInput,
    };
    return this.prisma.userSubscriptions.create({ data: subscriptionData });
  }

  async getUserSubscription(userId: string) {
    return this.prisma.userSubscriptions.findUnique({ where: { userId } });
  }

  async updateUserSubscription(
    updateUserSubscriptionInput: UpdateUserSubscriptionInput,
  ) {
    const { userId, stripeSubscriptionId, ...updateData } =
      updateUserSubscriptionInput;
    return this.prisma.userSubscriptions.updateMany({
      where: {
        OR: [{ userId }, { stripeSubscriptionId }],
      },
      data: updateData,
    });
  }

  async checkSubscription(userId: string) {
    if (!userId) return false;

    const userSubscription = await this.prisma.userSubscriptions.findUnique({
      where: { userId },
      select: {
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
        status: true,
      },
    });

    if (!userSubscription) return false;

    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    const isValid =
      userSubscription.stripePriceId &&
      !['cancelled', 'unpaid', 'past_due'].includes(userSubscription.status) &&
      userSubscription.stripeCurrentPeriodEnd &&
      userSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS >
        Date.now();

    return isValid;
  }
}
