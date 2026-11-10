import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Funcion } from '../funciones/entities/funcion.entity';
import { BoletosController } from './boletos.controller';
import { BoletosService } from './boletos.service';
import { Boleto } from './entities/boleto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boleto, Funcion, Cliente]), AuthModule],
  controllers: [BoletosController],
  providers: [BoletosService],
  exports: [BoletosService, TypeOrmModule],
})
export class BoletosModule {}
