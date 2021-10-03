import { IsString, IsNotEmpty } from 'class-validator';

export class UsersDTO {
    @IsNotEmpty() @IsString() username: string;
    @IsNotEmpty() @IsString() password: string;
}
