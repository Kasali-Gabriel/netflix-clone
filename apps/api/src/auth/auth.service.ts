import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import refreshConfig from './config/refresh.config';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async registerUser(createUserInput: CreateUserInput) {
    return await this.userService.createUser(createUserInput);
  }

  async userLogin(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(user.id, hashedRT);
    return {
      id: user.id,
      email: user.email,
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        `Incorrect password for ${email}. You can use a sign-in code, reset your password, or try again.`,
      );
    }

    return user;
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return { id: user.id };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');
    return { id: user.id };
  }

  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRT);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async signOut(userId: string) {
    return await this.userService.updateHashedRefreshToken(userId, null);
  }
}
