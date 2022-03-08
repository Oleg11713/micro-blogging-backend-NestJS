import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwtService from 'jsonwebtoken';

import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ email });
    if (!user.isActivated) {
      throw new BadRequestException('Пользователь не подтвердил почту');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const id = user.id;
      const displayName = user.displayName;
      const age = user.age;
      const role = user.role;
      const payload: JwtPayload = { id, displayName, age, email, role };
      return jwtService.sign(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: '24h',
      });
    } else {
      throw new UnauthorizedException('Проверьте введённые данные');
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  async userConfirmation(activationLink: string) {
    const user = await this.usersRepository.findOne({
      where: { activationLink },
    });
    if (!user) {
      throw new NotFoundException('Нет пользователя с такой ссылкой');
    }
    user.isActivated = true;
    await this.usersRepository.save(user);
  }
}
