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
import { AsignarGenerosDto } from './dto/asignar-generos.dto';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula } from './entities/pelicula.entity';
import { PeliculasService } from './peliculas.service';

@ApiTags('Películas')
@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas las películas',
    description: 'Incluye los géneros de cada película.',
  })
  @ApiOkResponse({ description: 'Lista de películas con sus géneros (200)', type: [Pelicula] })
  findAll() {
    return this.peliculasService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una película por id',
    description: 'Incluye sus géneros y sus funciones.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la película' })
  @ApiOkResponse({ description: 'Película con géneros y funciones (200)', type: Pelicula })
  @ApiErrores({ notFound: 'La película no existe (404)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peliculasService.findOne(id);
  }

  @Post()
  @Protegido()
  @ApiOperation({
    summary: 'Crear una película',
    description:
      'Puede recibir un arreglo opcional idGeneros con los géneros que se le asignan; todos deben existir.',
  })
  @ApiBody({ type: CreatePeliculaDto, description: 'Datos de la película e idGeneros (opcional)' })
  @ApiCreatedResponse({ description: 'Película creada (201)', type: Pelicula })
  @ApiErrores({
    badRequest: 'Datos inválidos (400)',
    notFound: 'Alguno de los géneros de idGeneros no existe (404)',
  })
  create(@Body() dto: CreatePeliculaDto) {
    return this.peliculasService.create(dto);
  }

  @Patch(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Actualizar los datos de una película',
    description: 'Los géneros se modifican con POST/DELETE /peliculas/:id/generos.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la película' })
  @ApiBody({ type: UpdatePeliculaDto, description: 'Cualquier campo de la película (todos opcionales)' })
  @ApiOkResponse({ description: 'Película actualizada (200)', type: Pelicula })
  @ApiErrores({ notFound: 'La película no existe (404)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePeliculaDto) {
    return this.peliculasService.update(id, dto);
  }

  @Delete(':id')
  @Protegido()
  @ApiOperation({
    summary: 'Eliminar una película',
    description: 'Borrado lógico: solo se guarda la fecha en eliminadoEn.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la película' })
  @ApiOkResponse({
    description: 'Película eliminada (200)',
    schema: { example: { message: 'La película con id 1 fue eliminada' } },
  })
  @ApiErrores({ notFound: 'La película no existe (404)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peliculasService.remove(id);
  }

  @Post(':id/generos')
  @Protegido()
  @ApiOperation({
    summary: 'Asignar géneros a una película',
    description: 'Asigna uno o más géneros. Todos los géneros deben existir.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la película' })
  @ApiBody({ type: AsignarGenerosDto, description: 'Arreglo idGeneros con los ids a asignar' })
  @ApiCreatedResponse({ description: 'Géneros asignados; devuelve la película (201)', type: Pelicula })
  @ApiErrores({ notFound: 'La película o alguno de los géneros no existe (404)' })
  asignarGeneros(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarGenerosDto,
  ) {
    return this.peliculasService.asignarGeneros(id, dto.idGeneros);
  }

  @Delete(':id/generos/:idGenero')
  @Protegido()
  @ApiOperation({ summary: 'Quitar un género de una película' })
  @ApiParam({ name: 'id', example: 1, description: 'Id de la película' })
  @ApiParam({ name: 'idGenero', example: 2, description: 'Id del género a quitar' })
  @ApiOkResponse({ description: 'Género quitado; devuelve la película (200)', type: Pelicula })
  @ApiErrores({
    badRequest: 'Ids inválidos o la película no tiene ese género asignado (400)',
    notFound: 'La película o el género no existe (404)',
  })
  quitarGenero(
    @Param('id', ParseIntPipe) id: number,
    @Param('idGenero', ParseIntPipe) idGenero: number,
  ) {
    return this.peliculasService.quitarGenero(id, idGenero);
  }
}
