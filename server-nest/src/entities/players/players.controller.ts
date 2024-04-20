import { Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PlayersService } from './players.service';

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

  // TODO add bot validation
  @Patch(':id')
  async update(@Req() req: Request, @Res() res: Response) {
    const player = await this.playersService.patch(req.params.id, req.body);
    return res.json(player);
  }
}
