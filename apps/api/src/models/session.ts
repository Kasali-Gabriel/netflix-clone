import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Session {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
