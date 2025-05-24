import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto'; // Pour le DTO d'inscription
import { JwtAuthGuard } from './jwt-auth.guard'; // Nous allons créer ce fichier

interface AuthenticatedRequest extends Request {
  user: any; // Le type de user sera celui retourné par JwtStrategy.validate()
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint de connexion
  @UseGuards(AuthGuard('local')) // 'local' sera une stratégie que nous devons créer
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  // Endpoint pour obtenir le profil de l'utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  // Optionnel: Endpoint d'inscription directe qui retourne aussi un token
  // Si vous préférez que /users (UsersController) gère l'inscription et retourne seulement l'utilisateur créé,
  // et que l'utilisateur doive se connecter séparément via /auth/login, alors supprimez cet endpoint.
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Ici, vous pouvez choisir de retourner l'utilisateur créé ou l'utilisateur et un token
    // Pour retourner un token, utilisez la méthode registerAndLogin de AuthService
    return this.authService.registerAndLogin(createUserDto);
    // Ou, si vous voulez juste créer l'utilisateur sans le loguer directement :
    // return this.usersService.create(createUserDto); // Assurez-vous d'injecter UsersService si vous utilisez cette option
  }
}
