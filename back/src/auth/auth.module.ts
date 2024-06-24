import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from "src/user/user.module"
import { AuthMiddleware } from "./auth.middleware"

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthMiddleware],
})
export class AuthModule {}
