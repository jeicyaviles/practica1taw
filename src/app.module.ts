import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BoletosModule } from './boletos/boletos.module';
import { ClientesModule } from './clientes/clientes.module';
import { FuncionesModule } from './funciones/funciones.module';
import { GenerosModule } from './generos/generos.module';
import { PeliculasModule } from './peliculas/peliculas.module';
import { SalasModule } from './salas/salas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // Crea/actualiza las tablas automáticamente (solo para desarrollo/práctica)
        synchronize: true,
      }),
    }),
    SalasModule,
    GenerosModule,
    PeliculasModule,
    FuncionesModule,
    ClientesModule,
    BoletosModule,
    AuthModule,
  ],
})
export class AppModule {}
