import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un usuario',
    description: 'Crea un usuario del personal del cine. La contraseña se guarda encriptada con bcrypt.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'Usuario registrado correctamente (201)' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o email ya registrado (400)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Devuelve un access_token (JWT) para usar en los endpoints protegidos.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login correcto (200)',
    schema: { example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } },
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos (400)' })
  @ApiUnauthorizedResponse({ description: 'Credenciales incorrectas (401)' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
