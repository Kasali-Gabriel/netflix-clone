import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from 'src/models/User';
import { CreateUserInput } from './dto/create-user.input';
import { UpdatePasswordInput } from './dto/update-password.input';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.createUser(createUserInput);
  }

  @Query(() => User, { nullable: true })
  async getUserByEmail(@Args('email') email: string) {
    return await this.userService.getUserByEmail(email);
  }

  @Query(() => User, { nullable: true })
  async getUserById(@Args('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Mutation(() => User)
  async changeUserEmail(
    @Args('userId') userId: string,
    @Args('newEmail') newEmail: string,
  ) {
    return await this.userService.changeUserEmail(userId, newEmail);
  }

  @Mutation(() => User)
  async changeUserPassword(
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
  ) {
    return await this.userService.changeUserPassword(updatePasswordInput);
  }
}
