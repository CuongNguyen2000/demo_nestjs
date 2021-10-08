import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {  
    @IsNotEmpty() username: string;
    @IsNotEmpty() password: string;
}
