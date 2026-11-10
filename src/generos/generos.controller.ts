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
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { Genero } from './entities/genero.entity';
import { GenerosService } from './generos.service';

@ApiTags('Géneros')
@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los géneros' })
  @ApiOkResponse({ description: 'Lista de géneros (200)', type: [Genero] })
  findAll() {
    return this.generosService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un género por id',
    description: 'Incluye las películas que pertenecen al género.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id del género' })
  @ApiOkResponse({ description: 'Género con sus películas (200)', type: Genero })
  @ApiErrores({ notFound: 'El género no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.generosService.findOne(id);
  }

  @Post()
  @Protegido()
  @ApiOperation({ summary: 'Crear un género' })
  @ApiBody({ type: CreateGeneroDto, description: 'nombre y descripción (opcional)' })
  @ApiCreatedResponse({ description: 'Género creado (201)', type: Genero })
  @ApiErrores()
  create(@Body() dto: CreateGeneroDto) {
    return this.generosService.create(dto);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({ summary: 'Actualizar un género' })
  @ApiParam({ name: 'id', example: 1, description: 'Id del género' })
  @ApiBody({ type: UpdateGeneroDto, description: 'Cualquier campo del género (todos opcionales)' })
  @ApiOkResponse({ description: 'Género actualizado (200)', type: Genero })
  @ApiErrores({ notFound: 'El género no existe (404)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGeneroDto) {
    return this.generosService.update(id, dto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar un género',
    description: 'Borrado lógico: solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id del género' })
  @ApiOkResponse({
    description: 'Género eliminado (200)',
    schema: { example: { message: 'El género con id 1 fue eliminado' } },
  })
  @ApiErrores({ notFound: 'El género no existe (404)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.generosService.remove(id);
  }
}
