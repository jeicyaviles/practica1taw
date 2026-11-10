import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export const TIPOS_SALA = ['2D', '3D', 'IMAX'];

export class CreateSalaDto {
  @ApiProperty({ example: 'Sala 1', description: 'Nombre de la sala' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 80, description: 'Cantidad de asientos de la sala' })
  @IsInt()
  @Min(1)
  capacidad: number;

  @ApiProperty({ example: '2D', enum: TIPOS_SALA })
  @IsIn(TIPOS_SALA, { message: 'tipo debe ser uno de: 2D, 3D, IMAX' })
  tipo: string;
}
