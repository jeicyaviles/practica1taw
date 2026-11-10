import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('salas')
export class Sala {
  @PrimaryGeneratedColumn({ name: 'id_sala' })
  idSala: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ type: 'varchar', length: 10 })
  tipo: string; // 2D, 3D, IMAX

  // 1 a N: Sala -> Funcion
  @OneToMany(() => Funcion, (funcion) => funcion.sala)
  funciones: Funcion[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminado_en' })
  eliminadoEn: Date;
}
