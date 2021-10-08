import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
import { UsersDTO } from './dto/users.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
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
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiResponse({ status: 200, description: 'success' })
    async login(@Req() req, @Res() res, @Body() body: LoginUserDto) {
        const auth = await this.authService.login(body);
        return res.status(200).json(auth.msg);
    }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async register(@Req() req, @Res() res, @Body() body: CreateUserDto) {
        const auth = await this.authService.createUser(body);
        return res.status(201).json(auth);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Req() req, @Res() res, @Param('id') id: UsersDTO) {
        const auth = await this.authService.findOneUser(id);
        return res.status(200).json(auth);
    }
}
