import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSubscriptionService } from 'src/user-subscription/user-subscription.service';
import { UserService } from 'src/user/user.service';
import { StripeWebhookController } from './stripe.controller';
import { StripeResolver } from './stripe.resolver';
import { StripeService } from './stripe.service';

@Module({
  imports: [],
  providers: [
    StripeResolver,
    StripeService,
    UserSubscriptionService,
    UserService,
    PrismaService,
  ],
  controllers: [StripeWebhookController],
})
export class StripeModule {}
