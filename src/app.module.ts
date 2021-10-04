import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get('database.uri'),
                // host: configService.get('database.host'),
                // port: configService.get('database.port'),
                // user: configService.get('database.user'),
                // password: configService.get('database.password'),
                // name: configService.get('database.name'),
                entities: [Users],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
