import { Field, ObjectType } from '@nestjs/graphql';
import { MyList } from './myList';

@ObjectType()
export class Profile {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  imageSrc: string;

  @Field()
  userId: string;

  @Field(() => [MyList], { nullable: true })
  my_list?: MyList[];
}
