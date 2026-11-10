import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateFuncionDto {
  @ApiProperty({ example: 1, description: 'Id de la sala (debe existir)' })
  @IsInt()
  idSala: number;

  @ApiProperty({ example: 1, description: 'Id de la película (debe existir)' })
  @IsInt()
  idPelicula: number;

  @ApiProperty({ example: '2026-11-20T19:30:00', description: 'Fecha y hora de la función (ISO 8601)' })
  @IsDateString()
  fechaHora: string;

  @ApiProperty({ example: 35.5, description: 'Precio de la entrada' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio: number;
}
