import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Sala } from './entities/sala.entity';

@Injectable()
export class SalasService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  findAll() {
    return this.salaRepository.find({ order: { idSala: 'ASC' } });
  }

  async findOne(id: number) {
    const sala = await this.salaRepository.findOne({
      where: { idSala: id },
      relations: { funciones: true },
    });
    if (!sala) throw new NotFoundException(`La sala con id ${id} no existe`);
    return sala;
  }

  create(dto: CreateSalaDto) {
    const sala = this.salaRepository.create(dto);
    return this.salaRepository.save(sala);
  }

  async update(id: number, dto: UpdateSalaDto) {
    const sala = await this.salaRepository.findOne({ where: { idSala: id } });
    if (!sala) throw new NotFoundException(`La sala con id ${id} no existe`);
    Object.assign(sala, dto);
    return this.salaRepository.save(sala);
  }

  async remove(id: number) {
    const sala = await this.salaRepository.findOne({ where: { idSala: id } });
    if (!sala) throw new NotFoundException(`La sala con id ${id} no existe`);
    await this.salaRepository.softDelete(id);
    return { message: `La sala con id ${id} fue eliminada` };
  }
}
