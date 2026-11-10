import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGeneroDto {
  @ApiProperty({ example: 'Acción' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'Películas con mucha acción y adrenalina' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
