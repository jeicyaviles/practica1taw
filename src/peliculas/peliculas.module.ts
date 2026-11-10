import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Genero } from '../generos/entities/genero.entity';
import { Pelicula } from './entities/pelicula.entity';
import { PeliculasController } from './peliculas.controller';
import { PeliculasService } from './peliculas.service';

// No existe módulo para pelicula_genero: se maneja desde Películas
@Module({
  imports: [TypeOrmModule.forFeature([Pelicula, Genero]), AuthModule],
  controllers: [PeliculasController],
  providers: [PeliculasService],
  exports: [PeliculasService, TypeOrmModule],
})
export class PeliculasModule {}
