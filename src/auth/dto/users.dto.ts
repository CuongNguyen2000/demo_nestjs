import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDTO {
    @IsNotEmpty()  id: string;
    @IsNotEmpty()  username: string;
}
