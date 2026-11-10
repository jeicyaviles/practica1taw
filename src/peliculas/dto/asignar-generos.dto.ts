import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class AsignarGenerosDto {
  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  idGeneros: number[];
}
