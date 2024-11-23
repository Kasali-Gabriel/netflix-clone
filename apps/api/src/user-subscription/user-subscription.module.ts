import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSubscriptionResolver } from './user-subscription.resolver';
import { UserSubscriptionService } from './user-subscription.service';

@Module({
  providers: [UserSubscriptionResolver, UserSubscriptionService, PrismaService],
})
export class UserSubscriptionModule {}
