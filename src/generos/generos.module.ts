import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Genero } from './entities/genero.entity';
import { GenerosController } from './generos.controller';
import { GenerosService } from './generos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genero]), AuthModule],
  controllers: [GenerosController],
  providers: [GenerosService],
  exports: [GenerosService, TypeOrmModule],
})
export class GenerosModule {}
