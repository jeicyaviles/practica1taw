import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genero } from '../../generos/entities/genero.entity';
import { Funcion } from '../../funciones/entities/funcion.entity';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn({ name: 'id_pelicula' })
  idPelicula: number;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  sinopsis: string;

  @Column({ type: 'int', name: 'duracion_min' })
  duracionMin: number;

  @Column({ type: 'varchar', length: 10 })
  clasificacion: string; // ATP, +13, +18

  // N a M automática: TypeORM crea la tabla pelicula_genero (solo con las dos FK)
  @ManyToMany(() => Genero, (genero) => genero.peliculas)
  @JoinTable({
    name: 'pelicula_genero',
    joinColumn: { name: 'id_pelicula', referencedColumnName: 'idPelicula' },
    inverseJoinColumn: { name: 'id_genero', referencedColumnName: 'idGenero' },
  })
  generos: Genero[];

  // 1 a N: Pelicula -> Funcion
  @OneToMany(() => Funcion, (funcion) => funcion.pelicula)
  funciones: Funcion[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminado_en' })
  eliminadoEn: Date;
}
