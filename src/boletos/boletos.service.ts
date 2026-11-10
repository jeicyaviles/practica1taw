import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Funcion } from '../funciones/entities/funcion.entity';
import { CreateBoletoDto } from './dto/create-boleto.dto';
import { UpdateBoletoDto } from './dto/update-boleto.dto';
import { Boleto } from './entities/boleto.entity';

@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private readonly boletoRepository: Repository<Boleto>,
    @InjectRepository(Funcion)
    private readonly funcionRepository: Repository<Funcion>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  findAll() {
    return this.boletoRepository.find({
      relations: { funcion: true, cliente: true },
      order: { idBoleto: 'ASC' },
    });
  }

  async findOne(id: number) {
    const boleto = await this.boletoRepository.findOne({
      where: { idBoleto: id },
      relations: { funcion: true, cliente: true },
    });
    if (!boleto) throw new NotFoundException(`El boleto con id ${id} no existe`);
    return boleto;
  }

  /** Vende un boleto aplicando las reglas de negocio. */
  async create(dto: CreateBoletoDto) {
    const funcion = await this.buscarFuncion(dto.idFuncion);
    await this.validarCliente(dto.idCliente);
    await this.validarAsiento(funcion, dto.numeroAsiento);

    const boleto = this.boletoRepository.create({
      idFuncion: dto.idFuncion,
      idCliente: dto.idCliente,
      numeroAsiento: dto.numeroAsiento,
      // Si no se envía precioPagado se guarda el precio de la función
      precioPagado: dto.precioPagado ?? funcion.precio,
    });

    const guardado = await this.guardar(boleto);
    return this.findOne(guardado.idBoleto);
  }

  /** Las mismas reglas de negocio se validan al actualizar. */
  async update(id: number, dto: UpdateBoletoDto) {
    // Sin relations para que el cambio de idFuncion/idCliente se guarde correctamente
    const boleto = await this.boletoRepository.findOne({ where: { idBoleto: id } });
    if (!boleto) throw new NotFoundException(`El boleto con id ${id} no existe`);

    const idFuncion = dto.idFuncion ?? boleto.idFuncion;
    const numeroAsiento = dto.numeroAsiento ?? boleto.numeroAsiento;

    const funcion = await this.buscarFuncion(idFuncion);
    if (dto.idCliente !== undefined) await this.validarCliente(dto.idCliente);

    // Solo se revalida el asiento si cambió el asiento o la función
    if (dto.numeroAsiento !== undefined || dto.idFuncion !== undefined) {
      await this.validarAsiento(funcion, numeroAsiento, id);
    }

    boleto.idFuncion = idFuncion;
    boleto.numeroAsiento = numeroAsiento;
    if (dto.idCliente !== undefined) boleto.idCliente = dto.idCliente;
    if (dto.precioPagado !== undefined) boleto.precioPagado = dto.precioPagado;

    await this.guardar(boleto);
    return this.findOne(id);
  }

  /** Anula el boleto (borrado lógico). El asiento queda libre otra vez. */
  async remove(id: number) {
    const boleto = await this.boletoRepository.findOne({ where: { idBoleto: id } });
    if (!boleto) throw new NotFoundException(`El boleto con id ${id} no existe`);
    await this.boletoRepository.softDelete(id);
    return { message: `El boleto con id ${id} fue anulado` };
  }

  // ---------------------------------------------------------------- helpers

  private async buscarFuncion(idFuncion: number) {
    const funcion = await this.funcionRepository.findOne({
      where: { idFuncion },
      relations: { sala: true },
    });
    if (!funcion) throw new NotFoundException(`La función con id ${idFuncion} no existe`);
    return funcion;
  }

  private async validarCliente(idCliente: number) {
    const cliente = await this.clienteRepository.findOne({ where: { idCliente } });
    if (!cliente) throw new NotFoundException(`El cliente con id ${idCliente} no existe`);
  }

  /**
   * Reglas de negocio:
   *  1. El asiento debe estar entre 1 y la capacidad de la sala de la función.
   *  2. El asiento no puede estar ya vendido para la misma función.
   */
  private async validarAsiento(
    funcion: Funcion,
    numeroAsiento: number,
    idBoletoActual?: number,
  ) {
    const capacidad = funcion.sala.capacidad;
    if (numeroAsiento < 1 || numeroAsiento > capacidad) {
      throw new BadRequestException(
        `El asiento ${numeroAsiento} no es válido: la sala "${funcion.sala.nombre}" tiene capacidad para ${capacidad} asientos (válidos del 1 al ${capacidad})`,
      );
    }

    const ocupado = await this.boletoRepository.findOne({
      where: {
        idFuncion: funcion.idFuncion,
        numeroAsiento,
        ...(idBoletoActual !== undefined && { idBoleto: Not(idBoletoActual) }),
      },
    });
    if (ocupado) {
      throw new BadRequestException(
        `El asiento ${numeroAsiento} ya está ocupado para la función con id ${funcion.idFuncion}`,
      );
    }
  }

  private guardar(boleto: Boleto) {
    return this.boletoRepository.save(boleto);
  }
}
