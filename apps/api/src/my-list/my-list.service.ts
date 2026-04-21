import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyListInput } from './Dto/create-myList.input';

@Injectable()
export class MyListService {
  constructor(private readonly prisma: PrismaService) {}

  async addMovieToList(myListInput: MyListInput) {
    return this.prisma.myList.create({
      data: {
        ...myListInput,
      },
    });
  }

  async getLikedMovie(profileId: string, movieId: number) {
    return this.prisma.myList.findUnique({
      where: {
        profileId_movieId: { profileId, movieId },
      },
    });
  }

  async getLikedMovies(profileId: string) {
    return this.prisma.myList.findMany({
      where: { profileId },
    });
  }

  async removeMovieFromList(profileId: string, movieId: number) {
    return this.prisma.myList.delete({
      where: {
        profileId_movieId: { profileId, movieId },
      },
    });
  }
}
