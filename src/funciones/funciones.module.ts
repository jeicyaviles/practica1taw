import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Pelicula } from '../peliculas/entities/pelicula.entity';
import { Sala } from '../salas/entities/sala.entity';
import { Funcion } from './entities/funcion.entity';
import { FuncionesController } from './funciones.controller';
import { FuncionesService } from './funciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Funcion, Sala, Pelicula]), AuthModule],
  controllers: [FuncionesController],
  providers: [FuncionesService],
  exports: [FuncionesService, TypeOrmModule],
})
export class FuncionesModule {}
