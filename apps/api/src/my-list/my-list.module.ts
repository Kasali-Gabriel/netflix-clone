import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyListResolver } from './my-list.resolver';
import { MyListService } from './my-list.service';

@Module({
  providers: [MyListResolver, MyListService, PrismaService],
})
export class MyListModule {}
