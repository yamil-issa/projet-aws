// auth.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = 'your_secret_key';

  generateToken(user: User): string {
    const payload = { userId: user._id, username: user.username, email: user.email };
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '1h' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
}
