import { Body, Controller, Param, Post, Put, UsePipes } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GamesService } from './games.service';
import { Game, IGame, UpdateGame } from './game.schema';
import { ValibotValidationPipe } from 'src/shared/pipes/custom-pipe/valibot-validation.pipe';
import { SaveGameDTO } from './game.dto';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  // @Get()
  // async find(@Res() res: Response) {
  //   const players = await this.gamesService.find();
  //   return res.json(players);
  // }

  // @Get('captains')
  // async findCaptains(@Res() res: Response) {
  //   const captains = await this.gamesService.findCaptains();
  //   return res.json(captains);
  // }

  @Post()
  @ApiBody({ type: Game })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @UsePipes(new ValibotValidationPipe(SaveGameDTO))
  async save(@Body() game: IGame) {
    console.log(game);

    await this.gamesService.save(game);

    return { success: 'OK' };
  }

  // PUT /games/:id
  @Put(':id')
  @ApiBody({ type: UpdateGame })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGame) {
    // Update logic
  }
}
