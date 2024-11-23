import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from 'src/models/profile';
import { ProfileInput } from './dto/create-profile.input';
import { ProfilesService } from './profiles.service';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Mutation(() => Profile)
  async createProfile(@Args('profileInput') profileInput: ProfileInput) {
    return await this.profilesService.createProfile(profileInput);
  }

  @Mutation(() => Profile)
  async renameProfile(@Args('id') id: string, @Args('name') name: string) {
    return await this.profilesService.renameProfile(id, name);
  }

  @Mutation(() => Profile)
  async deleteProfile(@Args('id') id: string) {
    return await this.profilesService.deleteProfile(id);
  }

  @Query(() => [Profile], { nullable: true })
  async getProfiles(@Args('userId') userId: string) {
    return await this.profilesService.getProfiles(userId);
  }

  @Query(() => Profile, { nullable: true })
  async getProfile(@Args('id') id: string) {
    // Returns the Profile object
    return await this.profilesService.getProfile(id);
  }
}
