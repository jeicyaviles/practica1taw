import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Funcion } from '../../funciones/entities/funcion.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

/**
 * Tabla intermedia creada a mano entre Funcion y Cliente.
 * Además de las dos FK guarda el número de asiento y el precio pagado.
 */
@Entity('boletos')
export class Boleto {
  @PrimaryGeneratedColumn({ name: 'id_boleto' })
  idBoleto: number;

  @Column({ type: 'int', name: 'id_funcion' })
  idFuncion: number;

  @Column({ type: 'int', name: 'id_cliente' })
  idCliente: number;

  @Column({ type: 'int', name: 'numero_asiento' })
  numeroAsiento: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'precio_pagado',
    transformer: {
      to: (value?: number) => value,
      from: (value?: string | null) =>
        value === null || value === undefined ? value : parseFloat(value),
    },
  })
  precioPagado: number;

  @ManyToOne(() => Funcion, (funcion) => funcion.boletos, { nullable: false })
  @JoinColumn({ name: 'id_funcion' })
  funcion: Funcion;

  @ManyToOne(() => Cliente, (cliente) => cliente.boletos, { nullable: false })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminado_en' })
  eliminadoEn: Date;
}
