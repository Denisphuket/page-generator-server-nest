import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './admin.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin)
    private adminModel: typeof Admin,
    private jwtService: JwtService,
  ) {}

  async register(
    username: string,
    password: string,
    secretCode: string,
  ): Promise<{ message: string; token: string }> {
    const REGISTRATION_SECRET_CODE =
      process.env.REGISTRATION_SECRET_CODE ||
      'default_registration_secret_code';

    if (secretCode !== REGISTRATION_SECRET_CODE) {
      throw new UnauthorizedException('Неверный проверочный код');
    }

    const existingAdmin = await this.adminModel.findOne({
      where: { username },
    });
    if (existingAdmin) {
      throw new UnauthorizedException(
        'Администратор с таким именем уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.adminModel.create({
      username,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({
      username: admin.username,
      sub: admin.id,
    });

    return { message: 'Администратор зарегистрирован успешно', token };
  }

  async login(username: string, password: string): Promise<{ token: string }> {
    const admin = await this.adminModel.findOne({ where: { username } });
    if (!admin) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const token = this.jwtService.sign({
      username: admin.username,
      sub: admin.id,
    });

    return { token };
  }

  async verifyToken(
    token: string,
  ): Promise<{ valid: boolean; username?: string }> {
    try {
      const decoded = await this.jwtService.verify(token);
      return { valid: true, username: decoded.username };
    } catch (error) {
      return { valid: false };
    }
  }
}
