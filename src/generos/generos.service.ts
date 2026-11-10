import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { Genero } from './entities/genero.entity';

@Injectable()
export class GenerosService {
  constructor(
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,
  ) {}

  findAll() {
    return this.generoRepository.find({ order: { idGenero: 'ASC' } });
  }

  async findOne(id: number) {
    const genero = await this.generoRepository.findOne({
      where: { idGenero: id },
      relations: { peliculas: true },
    });
    if (!genero) throw new NotFoundException(`El género con id ${id} no existe`);
    return genero;
  }

  create(dto: CreateGeneroDto) {
    const genero = this.generoRepository.create(dto);
    return this.generoRepository.save(genero);
  }

  async update(id: number, dto: UpdateGeneroDto) {
    const genero = await this.generoRepository.findOne({ where: { idGenero: id } });
    if (!genero) throw new NotFoundException(`El género con id ${id} no existe`);
    Object.assign(genero, dto);
    return this.generoRepository.save(genero);
  }

  async remove(id: number) {
    const genero = await this.generoRepository.findOne({ where: { idGenero: id } });
    if (!genero) throw new NotFoundException(`El género con id ${id} no existe`);
    await this.generoRepository.softDelete(id);
    return { message: `El género con id ${id} fue eliminado` };
  }
}
