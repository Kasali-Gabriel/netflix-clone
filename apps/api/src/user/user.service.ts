import { Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserInput } from './dto/create-user.input';
import { UpdatePasswordInput } from './dto/update-password.input';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserInput: CreateUserInput) {
    const { password, ...user } = createUserInput;
    const hashedPassword = await hash(password);
    return await this.prisma.users.create({
      data: {
        id: uuidv4(),
        ...user,
        password: hashedPassword,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserById(id: string) {
    return await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async changeUserEmail(userId: string, newEmail: string) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      throw new Error('Email is already in use');
    }

    return await this.prisma.users.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }

  async changeUserPassword(UpdatePasswordInput: UpdatePasswordInput) {
    const { userId, oldPassword, newPassword, confirmPassword } =
      UpdatePasswordInput;

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isOldPasswordValid = await verify(user.password, oldPassword);
    if (!isOldPasswordValid) {
      throw new Error('Old password is incorrect');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const isSamePassword = await verify(user.password, newPassword);
    if (isSamePassword) {
      throw new Error('New password must be different from the old password');
    }

    const hashedPassword = await hash(newPassword);
    return await this.prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateHashedRefreshToken(userId: string, hashedRT: string | null) {
    return await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRT,
      },
    });
  }
}
