import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(userName: string, userEmail: string, password: string) {
    const username = userName;
    const email = userEmail;
    const newUser = new this.userModel({
      username,
      email,
      password,
    });
    await newUser.save();
    return newUser;
  }

  
  async getUser(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

}
