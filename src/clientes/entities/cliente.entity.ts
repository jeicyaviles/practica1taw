import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Boleto } from '../../boletos/entities/boleto.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  idCliente: number;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  paterno: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  materno: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  // N a M manual: Cliente <-> Funcion a través de Boleto
  @OneToMany(() => Boleto, (boleto) => boleto.cliente)
  boletos: Boleto[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminado_en' })
  eliminadoEn: Date;
}
