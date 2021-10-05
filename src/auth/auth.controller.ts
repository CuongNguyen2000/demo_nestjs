import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { UsersDTO } from './dto/users.dto';
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
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: 'success' })
    async login(@Req() req, @Res() res, @Body() body: UsersDTO) {
        const auth = await this.authService.login(body);
        res.status(auth.status).json(auth.msg);
    }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async register(@Req() req, @Res() res, @Body() body: UsersDTO) {
        const auth = await this.authService.createUser(body);
        res.status(auth.status).json(auth.content);
    }
}
