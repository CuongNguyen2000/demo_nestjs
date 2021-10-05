import { Injectable } from '@nestjs/common';
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
    ) {}

    async login(user: any): Promise<Record<string, any>> {
        // Validation Flag
        let isOk = false;

        // Transform body into DTO
        const userDTO = new UsersDTO();
        userDTO.username = user.username;
        userDTO.password = user.password;

        // Validate DTO against validate function from class-validator
        await validate(userDTO).then(errors => {
            if (errors.length > 0) {
                this.logger.debug(`${errors}`, AuthService.name);
            } else {
                isOk = true;
            }
        });

        if (isOk) {
            // Get user information
            const userDetails = await this.usersRepository.findOne({
                username: user.username,
            });
            if (userDetails == null) {
                return { status: 401, msg: { msg: 'Invalid credentials' } };
            }

            // Check if the given password match with saved password
            const isValid = bcrypt.compareSync(
                user.password,
                userDetails.password,
            );
            // console.log(isValid);
            if (isValid) {
                return {
                    status: 200,
                    msg: {
                        username: user.username,
                        access_token: this.jwtService.sign({
                            username: user.username,
                        }),
                    },
                };
            } else {
                return { status: 401, msg: { msg: 'Invalid credentials' } };
            }
        } else {
            return { status: 400, msg: { msg: 'Invalid fields.' } };
        }
    }

    async createUser(body: any): Promise<Record<string, any>> {
        // Validation Flag
        let isOk = false;

        // Transform body into DTO
        const userDTO = new UsersDTO();
        userDTO.username = body.username;
        userDTO.password = bcrypt.hashSync(body.password, 10);

        // Validate DTO against validate function from class-validator
        await validate(userDTO).then(errors => {
            if (errors.length > 0) {
                this.logger.debug(`${errors}`, AuthService.name);
            } else {
                isOk = true;
            }
        });
        if (isOk) {
            const newUser = await this.usersRepository
                .save(userDTO)
                .catch(error => {
                    this.logger.debug(error.message, AuthService.name);
                    isOk = false;
                });
            console.log(newUser);
            if (isOk) {
                return {
                    status: 201,
                    content: { msg: `User created with success` },
                };
            } else {
                return { status: 400, content: { msg: 'User already exists' } };
            }
        } else {
            return { status: 400, content: { msg: 'Invalid content' } };
        }
    }
}
