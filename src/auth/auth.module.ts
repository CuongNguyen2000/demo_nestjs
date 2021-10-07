import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from '../logger/logger.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { PRIVATE_KEY, PUBLIC_KEY } from '../scripts/readKey'

@Module({
    imports: [
        PassportModule,
        LoggerModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    privateKey: PRIVATE_KEY,
                    publicKey: PUBLIC_KEY,
                    signOptions: { expiresIn: '60s', algorithm: 'RS256' },
                };
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Users]),
    ],
    providers: [JwtStrategy, AuthService],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }
