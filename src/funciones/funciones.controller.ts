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
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';
import { Funcion } from './entities/funcion.entity';
import { FuncionesService } from './funciones.service';

@ApiTags('Funciones')
@Controller('funciones')
export class FuncionesController {
  constructor(private readonly funcionesService: FuncionesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las funciones',
    description: 'Incluye la sala y la película de cada función.',
  })
  @ApiOkResponse({ description: 'Lista de funciones (200)', type: [Funcion] })
  findAll() {
    return this.funcionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una función por id',
    description: 'Incluye su sala, su película y los boletos vendidos.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la función' })
  @ApiOkResponse({ description: 'Función con sala, película y boletos (200)', type: Funcion })
  @ApiErrores({ notFound: 'La función no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.funcionesService.findOne(id);
  }

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Crear una función',
    description: 'Requiere idSala e idPelicula de registros existentes.',
  })
  @ApiBody({ type: CreateFuncionDto, description: 'idSala, idPelicula, fechaHora y precio' })
  @ApiCreatedResponse({ description: 'Función creada (201)', type: Funcion })
  @ApiErrores({
    badRequest: 'Datos inválidos (400)',
    notFound: 'La sala o la película no existe (404)',
  })
  create(@Body() dto: CreateFuncionDto) {
    return this.funcionesService.create(dto);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Actualizar una función',
    description: 'Permite cambiar fecha y hora, precio, sala o película.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la función' })
  @ApiBody({ type: UpdateFuncionDto, description: 'Cualquier campo de la función (todos opcionales)' })
  @ApiOkResponse({ description: 'Función actualizada (200)', type: Funcion })
  @ApiErrores({
    badRequest: 'Datos inválidos (400)',
    notFound: 'La función, la sala o la película no existe (404)',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFuncionDto) {
    return this.funcionesService.update(id, dto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar una función',
    description: 'Borrado lógico: solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la función' })
  @ApiOkResponse({
    description: 'Función eliminada (200)',
    schema: { example: { message: 'La función con id 1 fue eliminada' } },
  })
  @ApiErrores({ notFound: 'La función no existe (404)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.funcionesService.remove(id);
  }
}
