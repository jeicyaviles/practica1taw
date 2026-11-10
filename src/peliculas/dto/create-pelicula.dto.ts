import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const CLASIFICACIONES = ['ATP', '+13', '+18'];

export class CreatePeliculaDto {
  @ApiProperty({ example: 'Interestelar' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiPropertyOptional({ example: 'Un grupo de astronautas viaja por un agujero de gusano.' })
  @IsOptional()
  @IsString()
  sinopsis?: string;

  @ApiProperty({ example: 169, description: 'Duración en minutos' })
  @IsInt()
  @Min(1)
  duracionMin: number;

  @ApiProperty({ example: '+13', enum: CLASIFICACIONES })
  @IsIn(CLASIFICACIONES, { message: 'clasificacion debe ser uno de: ATP, +13, +18' })
  clasificacion: string;

  @ApiPropertyOptional({
    example: [1, 2],
    type: [Number],
    description: 'Ids de los géneros a asignar (todos deben existir)',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  idGeneros?: number[];
}
