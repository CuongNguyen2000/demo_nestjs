import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get(ConfigService);
    const logger: LoggerService = new LoggerService();

    const config = new DocumentBuilder()
        .setTitle('Auth API')
        .setDescription('Auth API') 
        .setVersion('1.0')
        .build()

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);


    app.enableCors();
    logger.verbose(`Database URI => ${configService.get('database.uri')}`);
    logger.verbose(`Application listening on port => ${process.env.PORT}`);
    await app.listen(process.env.PORT);
}
bootstrap();
