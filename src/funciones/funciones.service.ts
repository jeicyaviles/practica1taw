import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Sala } from '../salas/entities/sala.entity';
import { CreateFuncionDto } from './dto/create-funcion.dto';
import { UpdateFuncionDto } from './dto/update-funcion.dto';
import { Funcion } from './entities/funcion.entity';

@Injectable()
export class FuncionesService {
  constructor(
    @InjectRepository(Funcion)
    private readonly funcionRepository: Repository<Funcion>,
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
    @InjectRepository(Pelicula)
    private readonly peliculaRepository: Repository<Pelicula>,
  ) {}

  findAll() {
    return this.funcionRepository.find({
      relations: { sala: true, pelicula: true },
      order: { idFuncion: 'ASC' },
    });
  }

  async findOne(id: number) {
    const funcion = await this.funcionRepository.findOne({
      where: { idFuncion: id },
      relations: { sala: true, pelicula: true, boletos: true },
    });
    if (!funcion) throw new NotFoundException(`La función con id ${id} no existe`);
    return funcion;
  }

  async create(dto: CreateFuncionDto) {
    await this.validarSala(dto.idSala);
    await this.validarPelicula(dto.idPelicula);

    const funcion = this.funcionRepository.create({
      ...dto,
      fechaHora: new Date(dto.fechaHora),
    });
    const guardada = await this.funcionRepository.save(funcion);
    return this.findOne(guardada.idFuncion);
  }

  async update(id: number, dto: UpdateFuncionDto) {
    // Sin relations para que el cambio de idSala/idPelicula se guarde correctamente
    const funcion = await this.funcionRepository.findOne({ where: { idFuncion: id } });
    if (!funcion) throw new NotFoundException(`La función con id ${id} no existe`);

    if (dto.idSala !== undefined) await this.validarSala(dto.idSala);
    if (dto.idPelicula !== undefined) await this.validarPelicula(dto.idPelicula);

    const { fechaHora, ...resto } = dto;
    Object.assign(funcion, resto);
    if (fechaHora) funcion.fechaHora = new Date(fechaHora);

    await this.funcionRepository.save(funcion);
    return this.findOne(id);
  }

  async remove(id: number) {
    const funcion = await this.funcionRepository.findOne({ where: { idFuncion: id } });
    if (!funcion) throw new NotFoundException(`La función con id ${id} no existe`);
    await this.funcionRepository.softDelete(id);
    return { message: `La función con id ${id} fue eliminada` };
  }

  private async validarSala(idSala: number) {
    const sala = await this.salaRepository.findOne({ where: { idSala } });
    if (!sala) throw new NotFoundException(`La sala con id ${idSala} no existe`);
  }

  private async validarPelicula(idPelicula: number) {
    const pelicula = await this.peliculaRepository.findOne({ where: { idPelicula } });
    if (!pelicula) throw new NotFoundException(`La película con id ${idPelicula} no existe`);
  }
}
