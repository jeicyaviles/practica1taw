import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin@cine.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secreta123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
