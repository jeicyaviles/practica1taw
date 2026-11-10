import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrores, Protegido } from '../common/api-responses.decorator';
import { BoletosService } from './boletos.service';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';

@ApiTags('Boletos')
@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los boletos',
    description: 'Incluye la función y el cliente de cada boleto.',
  })
  @ApiOkResponse({ description: 'Lista de boletos (200)', type: [Boleto] })
  findAll() {
    return this.boletosService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un boleto por id',
    description: 'Incluye su función y su cliente.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id del boleto' })
  @ApiOkResponse({ description: 'Boleto con función y cliente (200)', type: Boleto })
  @ApiErrores({ notFound: 'El boleto no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.findOne(id);
  }

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Vender un boleto',
    description:
      'Requiere idFuncion e idCliente existentes. El asiento debe estar entre 1 y la capacidad de la sala y no estar ocupado en esa función. Si no se envía precioPagado se guarda el precio de la función.',
  })
  @ApiBody({
    type: CreateBoletoDto,
    description: 'idFuncion, idCliente, numeroAsiento y precioPagado (opcional)',
  })
  @ApiCreatedResponse({ description: 'Boleto vendido (201)', type: Boleto })
  @ApiErrores({
    badRequest:
      'Datos inválidos, asiento fuera de rango de la sala o asiento ya ocupado (400)',
    notFound: 'La función o el cliente no existe (404)',
  })
  create(@Body() dto: CreateBoletoDto) {
    return this.boletosService.create(dto);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Actualizar un boleto',
    description:
      'Permite cambiar el número de asiento o el precio pagado. Se validan las mismas reglas de negocio que en la venta.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id del boleto' })
  @ApiBody({ type: UpdateBoletoDto, description: 'numeroAsiento y/o precioPagado (todos opcionales)' })
  @ApiOkResponse({ description: 'Boleto actualizado (200)', type: Boleto })
  @ApiErrores({
    badRequest:
      'Datos inválidos, asiento fuera de rango de la sala o asiento ya ocupado (400)',
    notFound: 'El boleto, la función o el cliente no existe (404)',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBoletoDto) {
    return this.boletosService.update(id, dto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar (anular) un boleto',
    description: 'Borrado lógico: el boleto queda anulado y el asiento vuelve a estar disponible.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id del boleto' })
  @ApiOkResponse({
    description: 'Boleto anulado (200)',
    schema: { example: { message: 'El boleto con id 1 fue anulado' } },
  })
  @ApiErrores({ notFound: 'El boleto no existe (404)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.boletosService.remove(id);
  }
}
