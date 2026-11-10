import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  findAll() {
    return this.clienteRepository.find({ order: { idCliente: 'ASC' } });
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { idCliente: id },
      relations: { boletos: { funcion: true } },
    });
    if (!cliente) throw new NotFoundException(`El cliente con id ${id} no existe`);
    return cliente;
  }

  create(dto: CreateClienteDto) {
    const cliente = this.clienteRepository.create(dto);
    return this.clienteRepository.save(cliente);
  }

  async update(id: number, dto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.findOne({ where: { idCliente: id } });
    if (!cliente) throw new NotFoundException(`El cliente con id ${id} no existe`);
    Object.assign(cliente, dto);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.clienteRepository.findOne({ where: { idCliente: id } });
    if (!cliente) throw new NotFoundException(`El cliente con id ${id} no existe`);
    await this.clienteRepository.softDelete(id);
    return { message: `El cliente con id ${id} fue eliminado` };
  }
}
