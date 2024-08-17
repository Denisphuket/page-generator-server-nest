import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('admin/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('secretCode') secretCode: string,
  ): Promise<{ message: string; token: string }> {
    return this.authService.register(username, password, secretCode);
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    return this.authService.login(username, password);
  }

  @Post('verify-token')
  async verifyToken(@Headers('authorization') authHeader: string) {
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return { valid: false, message: 'Токен отсутствует' };
    }
    const result = await this.authService.verifyToken(token);
    if (result.valid) {
      return { valid: true, username: result.username };
    } else {
      return { valid: false, message: 'Неверный или истекший токен' };
    }
  }
}
