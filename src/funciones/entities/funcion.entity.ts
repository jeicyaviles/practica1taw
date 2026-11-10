import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sala } from '../../salas/entities/sala.entity';
import { Pelicula } from '../../peliculas/entities/pelicula.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';

@Entity('funciones')
export class Funcion {
  @PrimaryGeneratedColumn({ name: 'id_funcion' })
  idFuncion: number;

  @Column({ type: 'int', name: 'id_sala' })
  idSala: number;

  @Column({ type: 'int', name: 'id_pelicula' })
  idPelicula: number;

  @Column({ type: 'datetime', name: 'fecha_hora' })
  fechaHora: Date;

  // Decimal: se transforma a number para no recibir strings desde MySQL
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value?: number) => value,
      from: (value?: string | null) =>
        value === null || value === undefined ? value : parseFloat(value),
    },
  })
  precio: number;

  // 1 a N: Sala -> Funcion
  @ManyToOne(() => Sala, (sala) => sala.funciones, { nullable: false })
  @JoinColumn({ name: 'id_sala' })
  sala: Sala;

  // 1 a N: Pelicula -> Funcion
  @ManyToOne(() => Pelicula, (pelicula) => pelicula.funciones, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_pelicula' })
  pelicula: Pelicula;

  // N a M manual: Funcion <-> Cliente a través de Boleto
  @OneToMany(() => Boleto, (boleto) => boleto.funcion)
  boletos: Boleto[];

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;

  @DeleteDateColumn({ name: 'eliminado_en' })
  eliminadoEn: Date;
}
