import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePeliculaDto } from './create-pelicula.dto';

// Los géneros no se modifican por PATCH /peliculas/:id; se manejan con
// POST /peliculas/:id/generos y DELETE /peliculas/:id/generos/:idGenero
export class UpdatePeliculaDto extends PartialType(
  OmitType(CreatePeliculaDto, ['idGeneros'] as const),
) {}
