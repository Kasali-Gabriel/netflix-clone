import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import refreshConfig from './config/refresh.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
  ],
  providers: [
    AuthResolver,
    AuthService,
    UserService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
  ],
})
export class AuthModule {}
