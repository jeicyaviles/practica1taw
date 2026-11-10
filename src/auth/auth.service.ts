import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existe = await this.usuarioRepository.findOne({
      where: { email: dto.email },
    });
    if (existe) {
      throw new BadRequestException(
        `Ya existe un usuario con el email ${dto.email}`,
      );
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const usuario = this.usuarioRepository.create({
      username: dto.username,
      email: dto.email,
      password: hash,
    });
    const guardado = await this.usuarioRepository.save(usuario);

    return {
      idUsuario: guardado.idUsuario,
      username: guardado.username,
      email: guardado.email,
      creadoEn: guardado.creadoEn,
    };
  }

  async login(dto: LoginDto) {
    // password tiene select:false, por eso se pide explícitamente
    const usuario = await this.usuarioRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email: dto.email })
      .getOne();

    if (!usuario || !(await bcrypt.compare(dto.password, usuario.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: usuario.idUsuario,
      username: usuario.username,
      email: usuario.email,
    };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
