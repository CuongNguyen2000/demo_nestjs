import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersDTO } from './dto/users.dto';
import { validate } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private logger: LoggerService,
        private jwtService: JwtService,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) { }

    async login(user: UsersDTO): Promise<Record<string, any>> {

        const userDTO = new UsersDTO();
        userDTO.username = user.username;
        userDTO.password = user.password;

        const check = await validate(userDTO);
        console.log(check)

        if (check.length > 0) {
            this.logger.debug(`${check}`, AuthService.name);
            throw new HttpException('Invalid Fields', HttpStatus.BAD_REQUEST);
        }

        // Get user information
        const userDetails = await this.usersRepository.findOne({
            username: user.username,
        });

        if (!userDetails) throw new UnauthorizedException('Users does not exist');

        // Check if the given password match with saved password
        const isValid = bcrypt.compareSync(
            user.password,
            userDetails.password,
        );
        // console.log(isValid);
        if (isValid) {
            return {
                msg: {
                    username: user.username,
                    access_token: this.jwtService.sign({
                        username: user.username,
                    }),
                },
            };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async createUser(body: UsersDTO): Promise<Record<string, any>> {
        // Validation Flag
        let isOk = false;

        // Transform body into DTO
        const userDTO = new UsersDTO();
        userDTO.username = body.username;
        userDTO.password = bcrypt.hashSync(body.password, 10);

        // Validate DTO against validate function from class-validator
        const check = await validate(userDTO);
        console.log(check)

        if (check.length > 0) {
            this.logger.debug(`${check}`, AuthService.name);
            throw new HttpException('Invalid content', HttpStatus.BAD_REQUEST);
        } else {
            isOk = true;
        }

        const newUser = await this.usersRepository
            .save(userDTO)
            .catch(error => {
                this.logger.debug(error.message, AuthService.name);
                isOk = false;
            });

        console.log(newUser);

        if (isOk) {
            return {
                content: { msg: `User created with success` },
            };
        } else {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
    }
}
