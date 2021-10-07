import { Body, ConsoleLogger, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { validate } from 'class-validator';
import { UsersDTO } from './dto/users.dto';
import { LoggerService } from '../logger/logger.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private logger: LoggerService,
    ) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: 'success' })
    async login(@Req() req, @Res() res, @Body() body: UsersDTO) {

        const auth = await this.authService.login(body);
        res.status(200).json(auth.msg);

    }

    // @UseGuards(JwtAuthGuard)
    @Post('register')
    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async register(@Req() req, @Res() res, @Body() body: UsersDTO) {

        const auth = await this.authService.createUser(body);
        res.status(201).json(auth.content);
    }
}
