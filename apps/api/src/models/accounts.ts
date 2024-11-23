import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User';

@ObjectType()
export class Accounts {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  type: string;

  @Field()
  provider: string;

  @Field()
  provider_account_id: string;

  @Field({ nullable: true })
  scope?: string;

  @Field({ nullable: true })
  session_state?: string;

  @Field(() => User)
  users: User;
}
