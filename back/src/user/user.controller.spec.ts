import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('UserController', () => {
 let userController: UserController;
 let userService: UserService;
 let authService: AuthService;

 beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue({ id: '1', username: 'testUser' }),
            getUser: jest.fn().mockResolvedValue({ id: '1', username: 'testUser', password: await bcrypt.hash('password', 10) }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
 });

 it('should add a user', async () => {
    const createUserDto = { username: 'testUser', email: 'test@example.com', password: 'password' };
    const result = await userController.addUser(createUserDto);
    expect(result).toEqual({
      msg: 'User successfully created',
      userId: '1',
      userName: 'testUser',
    });
    expect(userService.createUser).toHaveBeenCalledWith(createUserDto.username, createUserDto.email, expect.any(String));
 });

 it('should throw BadRequestException if username or email is empty', async () => {
    const createUserDto = { username: '', email: 'test@example.com', password: 'password' };
    await expect(userController.addUser(createUserDto)).rejects.toThrow(BadRequestException);
 });

 it('should login a user', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    const result = await userController.login(credentials);
    expect(result).toEqual({
      msg: 'User successfully logged in',
      token: 'token',
    });
    expect(authService.generateToken).toHaveBeenCalled();
 });

 it('should throw UnauthorizedException if login fails', async () => {
    const credentials = { email: 'wrong@example.com', password: 'wrongPassword' };
    await expect(userController.login(credentials)).rejects.toThrow(UnauthorizedException);
 });
});