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
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Sala } from './entities/sala.entity';
import { SalasService } from './salas.service';

@ApiTags('Salas')
@Controller('salas')
export class SalasController {
  constructor(private readonly salasService: SalasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las salas' })
  @ApiOkResponse({ description: 'Lista de salas (200)', type: [Sala] })
  findAll() {
    return this.salasService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una sala por id',
    description: 'Incluye las funciones programadas en la sala.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la sala' })
  @ApiOkResponse({ description: 'Sala con sus funciones (200)', type: Sala })
  @ApiErrores({ notFound: 'La sala no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salasService.findOne(id);
  }

  @Post()
  @Protegido()
  @ApiOperation({ summary: 'Crear una sala' })
  @ApiBody({ type: CreateSalaDto, description: 'nombre, capacidad y tipo (2D, 3D, IMAX)' })
  @ApiCreatedResponse({ description: 'Sala creada (201)', type: Sala })
  @ApiErrores()
  create(@Body() dto: CreateSalaDto) {
    return this.salasService.create(dto);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar una sala' })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la sala' })
  @ApiBody({ type: UpdateSalaDto, description: 'Cualquier campo de la sala (todos opcionales)' })
  @ApiOkResponse({ description: 'Sala actualizada (200)', type: Sala })
  @ApiErrores({ notFound: 'La sala no existe (404)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalaDto) {
    return this.salasService.update(id, dto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar una sala',
    description: 'Borrado lógico: solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la sala' })
  @ApiOkResponse({
    description: 'Sala eliminada (200)',
    schema: { example: { message: 'La sala con id 1 fue eliminada' } },
  })
  @ApiErrores({ notFound: 'La sala no existe (404)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salasService.remove(id);
  }
}
