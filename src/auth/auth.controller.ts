import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/viewUser/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }

  @Get('/viewAllUsers')
  getUsers(): Promise<User[]> {
    return this.authService.getUsers();
  }

  @Get('/activate/:activationLink')
  userConfirmation(@Param('activationLink') activationLink: string) {
    return this.authService.userConfirmation(activationLink);
  }
}
