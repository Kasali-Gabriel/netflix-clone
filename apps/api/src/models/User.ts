import { Field, ObjectType } from '@nestjs/graphql';
import { Accounts } from './accounts';
import { Profile } from './profile';
import { UserSubscription } from './userSubscription';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Accounts, { nullable: true })
  accounts?: Accounts;

  @Field(() => UserSubscription, { nullable: true })
  userSubscriptions?: UserSubscription;

  @Field(() => Profile, { nullable: true })
  profile?: Profile[];
}
