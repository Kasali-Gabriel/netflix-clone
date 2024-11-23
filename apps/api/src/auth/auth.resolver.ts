import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Session } from 'src/models/session';
import { User } from 'src/models/User';
import { CreateUserInput } from '../user/dto/create-user.input';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GqlLocalAuthGuard } from './guards/local-auth/local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async registerUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return await this.authService.registerUser(createUserInput);
  }

  @Public()
  @UseGuards(GqlLocalAuthGuard)
  @Mutation(() => Session)
  async userLogin(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.authService.userLogin(email, password);
  }
}
