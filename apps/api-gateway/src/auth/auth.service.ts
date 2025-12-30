import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  generateTokens(userId: string) {
    const access_token = this.jwt.sign({ sub: userId })
    const refresh_token = this.jwt.sign(
      { sub: userId }, 
      { expiresIn: '7d' }
    )

    return { access_token, refresh_token }
  }
}