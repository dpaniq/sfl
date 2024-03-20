import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Optional,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { GamesService } from './games.service';
import { Game, IGame, UpdateGame } from './game.schema';
import { ValibotValidationPipe } from 'src/shared/pipes/custom-pipe/valibot-validation.pipe';
import { SaveGameDTO } from './game.dto';
import { optional } from 'valibot';

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

  @Get()
  @ApiQuery({
    name: 'season',
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all games records',
  })
  async get(
    @Res() res: Response,
    @Query('season', new ParseIntPipe({ optional: true }))
    season?: number | undefined,
  ) {
    return res.json(
      await this.gamesService.find({
        ...(season ? { season } : null),
      }),
    );
  }

  @Post()
  @ApiBody({ type: Game })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @UsePipes(new ValibotValidationPipe(SaveGameDTO))
  async save(@Body() game: IGame) {
    console.log(game);

    return await this.gamesService.save(game);
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
