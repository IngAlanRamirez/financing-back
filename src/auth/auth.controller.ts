import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto'; // Adjust path as needed

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.clientNumber, loginDto.password_dont_send_to_client);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // In a real app, you'd return a JWT. For now, just a success message or user object.
    return { message: 'Login successful', userId: user.id };
  }
}
