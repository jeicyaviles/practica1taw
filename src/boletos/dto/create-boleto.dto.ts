import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBoletoDto {
  @ApiProperty({ example: 1, description: 'Id de la función (debe existir)' })
  @IsInt()
  idFuncion: number;

  @ApiProperty({ example: 1, description: 'Id del cliente (debe existir)' })
  @IsInt()
  idCliente: number;

  @ApiProperty({
    example: 15,
    description: 'Número de asiento, entre 1 y la capacidad de la sala',
  })
  @IsInt()
  @Min(1)
  numeroAsiento: number;

  @ApiPropertyOptional({
    example: 35.5,
    description: 'Si no se envía se guarda el precio de la función',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioPagado?: number;
}
