import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Genero } from '../generos/entities/genero.entity';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula } from './entities/pelicula.entity';

@Injectable()
export class PeliculasService {
  constructor(
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  findAll() {
    return this.peliculaRepository.find({
      relations: { generos: true },
      order: { idPelicula: 'ASC' },
    });
  }

  async findOne(id: number) {
    const pelicula = await this.peliculaRepository.findOne({
      where: { idPelicula: id },
      relations: { generos: true, funciones: true },
    });
    if (!pelicula) throw new NotFoundException(`La película con id ${id} no existe`);
    return pelicula;
  }

  async create(dto: CreatePeliculaDto) {
    const { idGeneros, ...datos } = dto;
    const pelicula = this.peliculaRepository.create(datos);

    if (idGeneros && idGeneros.length > 0) {
      pelicula.generos = await this.buscarGeneros(idGeneros);
    }

    const guardada = await this.peliculaRepository.save(pelicula);
    return this.findOne(guardada.idPelicula);
  }

  async update(id: number, dto: UpdatePeliculaDto) {
    const pelicula = await this.peliculaRepository.findOne({ where: { idPelicula: id } });
    if (!pelicula) throw new NotFoundException(`La película con id ${id} no existe`);
    Object.assign(pelicula, dto);
    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }

  async remove(id: number) {
    const pelicula = await this.peliculaRepository.findOne({ where: { idPelicula: id } });
    if (!pelicula) throw new NotFoundException(`La película con id ${id} no existe`);
    await this.peliculaRepository.softDelete(id);
    return { message: `La película con id ${id} fue eliminada` };
  }

  /** Asigna uno o más géneros a la película (sin duplicar los que ya tiene). */
  async asignarGeneros(id: number, idGeneros: number[]) {
    const pelicula = await this.peliculaRepository.findOne({
      where: { idPelicula: id },
      relations: { generos: true },
    });
    if (!pelicula) throw new NotFoundException(`La película con id ${id} no existe`);

    const nuevos = await this.buscarGeneros(idGeneros);
    const yaAsignados = new Set(pelicula.generos.map((g) => g.idGenero));
    for (const genero of nuevos) {
      if (!yaAsignados.has(genero.idGenero)) pelicula.generos.push(genero);
    }

    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }

  /** Quita un género de la película. */
  async quitarGenero(id: number, idGenero: number) {
    const pelicula = await this.peliculaRepository.findOne({
      where: { idPelicula: id },
      relations: { generos: true },
    });
    if (!pelicula) throw new NotFoundException(`La película con id ${id} no existe`);

    const genero = await this.generoRepository.findOne({ where: { idGenero } });
    if (!genero) throw new NotFoundException(`El género con id ${idGenero} no existe`);

    if (!pelicula.generos.some((g) => g.idGenero === idGenero)) {
      throw new BadRequestException(
        `La película con id ${id} no tiene asignado el género con id ${idGenero}`,
      );
    }

    pelicula.generos = pelicula.generos.filter((g) => g.idGenero !== idGenero);
    await this.peliculaRepository.save(pelicula);
    return this.findOne(id);
  }

  /** Busca los géneros y lanza NotFoundException si alguno no existe. */
  private async buscarGeneros(idGeneros: number[]) {
    const ids = [...new Set(idGeneros)];
    const generos = await this.generoRepository.findBy({ idGenero: In(ids) });
    const encontrados = new Set(generos.map((g) => g.idGenero));
    const faltantes = ids.filter((i) => !encontrados.has(i));
    if (faltantes.length > 0) {
      throw new NotFoundException(
        faltantes.length === 1
          ? `El género con id ${faltantes[0]} no existe`
          : `Los géneros con id ${faltantes.join(', ')} no existen`,
      );
    }
    return generos;
  }
}
