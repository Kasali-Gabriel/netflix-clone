import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileInput } from './dto/create-profile.input';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(profileInput: ProfileInput) {
    const { userId, ...profile } = profileInput;
    const profileCount = await this.prisma.profile.count({ where: { userId } });

    if (profileCount >= 4) {
      throw new Error('You can only have up to 4 profiles.');
    }

    return this.prisma.profile.create({
      data: {
        id: uuidv4(),
        ...profile,
        userId,
      },
    });
  }

  async getProfiles(@Args('userId') userId: string) {
    return this.prisma.profile.findMany({
      where: { userId },
    });
  }

  async getProfile(@Args('id') id: string) {
    return this.prisma.profile.findUnique({
      where: { id },
    });
  }

  async deleteProfile(@Args('id') id: string) {
    return this.prisma.profile.delete({
      where: { id },
    });
  }

  async renameProfile(@Args('id') id: string, @Args('name') name: string) {
    return this.prisma.profile.update({
      where: { id },
      data: { name },
    });
  }
}
