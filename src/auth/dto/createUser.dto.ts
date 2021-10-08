import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'Cuongng22',
        description: 'The username that you registered',
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    password: string;
}
