import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './admin.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret:
        process.env.JWT_SECRET || 'saflkndvkljdsldkshfdshgf324cvmpsdlkor39320',
      signOptions: { expiresIn: '30d' },
    }),
    SequelizeModule.forFeature([Admin]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
