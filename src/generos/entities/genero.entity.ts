import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';

@Entity('generos')
export class Genero {
  @PrimaryGeneratedColumn({ name: 'id_genero' })
  idGenero: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // N a M (lado inverso). La tabla pelicula_genero la define Pelicula con @JoinTable
  @ManyToMany(() => Pelicula, (pelicula) => pelicula.generos)
  peliculas: Pelicula[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminado_en' })
  eliminadoEn: Date;
}
