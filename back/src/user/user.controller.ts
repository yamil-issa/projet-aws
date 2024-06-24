import { Controller, Get, Post, Put, Delete, Param, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { AddUserDto } from './add-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}
  //Signup
  @Post('/signup')
  async addUser(@Body() createUserDto: AddUserDto) {
    const { username, email, password } = createUserDto;

    // Check for empty fields
    if (!username || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    // Check for spaces
    if (username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) {
      throw new BadRequestException('Fields cannot be empty');
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const result = await this.userService.createUser(
      username,
      email,
      hashedPassword,
    );
    return {
      msg: 'User successfully created',
      userId: result.id,
      userName: result.username,
    };
  }

  //Login
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const user = await this.userService.getUser(credentials.email);
    if (user) {
      const passwordMatch = await bcrypt.compare(credentials.password, user.password);
      if (passwordMatch) {
        const token = this.authService.generateToken(user);
        return {
          msg: 'User successfully logged in',
          token };
      }
    }
    throw new UnauthorizedException('Invalid email or password');
  }
}

 
