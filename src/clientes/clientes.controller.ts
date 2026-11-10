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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiOkResponse({ description: 'Lista de clientes (200)', type: [Cliente] })
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un cliente por id',
    description: 'Incluye sus boletos y la función de cada uno.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id del cliente' })
  @ApiOkResponse({ description: 'Cliente con sus boletos (200)', type: Cliente })
  @ApiErrores({ notFound: 'El cliente no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Post()
  @Protegido()
  @ApiOperation({ summary: 'Crear un cliente' })
  @ApiBody({ type: CreateClienteDto, description: 'nombres, paterno, materno (opcional) y email' })
  @ApiCreatedResponse({ description: 'Cliente creado (201)', type: Cliente })
  @ApiErrores()
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar los datos de un cliente' })
  @ApiParam({ name: 'id', example: 1, description: 'Id del cliente' })
  @ApiBody({ type: UpdateClienteDto, description: 'Cualquier campo del cliente (todos opcionales)' })
  @ApiOkResponse({ description: 'Cliente actualizado (200)', type: Cliente })
  @ApiErrores({ notFound: 'El cliente no existe (404)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar un cliente',
    description: 'Borrado lógico: solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id del cliente' })
  @ApiOkResponse({
    description: 'Cliente eliminado (200)',
    schema: { example: { message: 'El cliente con id 1 fue eliminado' } },
  })
  @ApiErrores({ notFound: 'El cliente no existe (404)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}
