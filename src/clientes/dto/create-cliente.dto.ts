import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({ example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  paterno: string;

  @ApiPropertyOptional({ example: 'Mamani' })
  @IsOptional()
  @IsString()
  materno?: string;

  @ApiProperty({ example: 'juan.perez@email.com' })
  @IsEmail()
  email: string;
}
