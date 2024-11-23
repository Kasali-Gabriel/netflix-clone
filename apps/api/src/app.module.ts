import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { MyListModule } from './my-list/my-list.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfilesModule } from './profiles/profiles.module';
import { StripeModule } from './stripe/stripe.module';
import { UserSubscriptionModule } from './user-subscription/user-subscription.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
    }),
    UserModule,
    MyListModule,
    ProfilesModule,
    StripeModule,
    UserSubscriptionModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
