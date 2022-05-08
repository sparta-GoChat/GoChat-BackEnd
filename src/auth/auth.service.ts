import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlayersService } from 'src/players/players.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRepository } from 'src/players/players.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PlayerRepository)
    private playersService: PlayersService,
    private playersRepository: PlayerRepository,
    private jwtService: JwtService
  ) {}

  async validatePlayer(email: string, password: string): Promise<any> {
    const player = await this.playersRepository.findOne({ email: email });
    const valid = await bcrypt.compare(password, player.password);
    if (email && valid) {
      const { password, nickname, ...result } = player;
      return result;
    }
    return null;
  }

  async login(email: string, password: string): Promise<any> {
    console.log('login');
    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = {
      email: email,
      password: hashedPassword,
    };

    return {
      ok: true,
      row: {
        email: email,
        nickname: 'nickname',
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  kakaoLogin(req) {
    console.log(req.user);
    if (!req) {
      return 'No user from kakao';
    }
    return {
      message: 'User information from kakao',
      data: req.user,
    };
  }
}
