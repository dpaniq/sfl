import { Controller, Get, Res } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('player')
@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  async find(@Res() res: Response) {
    const players = await this.playersService.find();
    return res.json(players);
  }

  @Get('captains')
  async findCaptains(@Res() res: Response) {
    const captains = await this.playersService.findCaptains();
    return res.json(captains);
  }
}
