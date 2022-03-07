import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { JwtPayload } from './jwt-payload.interface';
import * as jwtService from 'jsonwebtoken';
import { ADMIN } from './admin-credentials';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private transporter: { sendMail: (arg0: object) => object };
  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      secure: false,
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD,
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMPT_USER,
      to,
      subject: 'Подтверждение регистрации аккаунта',
      text: '',
      html: `
            <div>
                <h1>Для подтверждения регистрации на сайте micro-blogging перейдите по ссылке</h1>
                <a href="${link}">Нажмите сюда</a>
            </div>
            `,
    });
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { displayName, age, email, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const activationLink = uuid.v4();
    const user = this.create({
      displayName,
      age,
      email,
      password: hashedPassword,
      activationLink,
    });
    await this.sendActivationMail(
      email,
      `${process.env.API_URL}/auth/activate/${activationLink}`,
    );
    try {
      await this.save(user);
      const id = user.id;
      const role = user.role;
      const payload: JwtPayload = { id, displayName, age, email, role };
      return jwtService.sign(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: '24h',
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      } else {
        throw new InternalServerErrorException('Ошибка');
      }
    }
  }

  async getUsers(): Promise<User[]> {
    const query = this.createQueryBuilder('user');
    const admin = await this.findOne({ where: { role: 'ADMIN' } });
    if (!admin) {
      const salt = await bcrypt.genSalt();
      ADMIN.password = await bcrypt.hash(ADMIN.password, salt);
      const initialAdmin = this.create(ADMIN);
      await this.save(initialAdmin);
    }
    return await query.getMany();
  }
}
