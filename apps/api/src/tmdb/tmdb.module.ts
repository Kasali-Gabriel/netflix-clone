import { Module } from '@nestjs/common';
import { TmdbResolver } from './tmdb.resolver';
import { TmdbService } from './tmdb.service';

@Module({
  providers: [TmdbService, TmdbResolver],
  exports: [TmdbService],
})
export class TmdbModule {}
