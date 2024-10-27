import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ValibotValidationPipe } from 'src/shared/pipes/custom-pipe/valibot-validation.pipe';
import { SaveGameDTO } from './game.dto';
import { Game, IGame, UpdateGame } from './game.schema';
import { GamesService } from './games.service';

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
    name: 'id',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'season',
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all games records',
  })
  async find(
    @Res() res: Response,
    @Query('id')
    _id?: string | undefined,
    @Query('season', new ParseIntPipe({ optional: true }))
    season?: number | undefined,
  ) {
    return res.json(
      await this.gamesService.find({
        ...(_id ? { _id } : null),
        ...(season ? { season } : null),
      }),
    );
  }

  // Get /games/:id
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all games records',
  })
  async findById(
    @Res() res: Response,
    @Param('id')
    id: string,
  ) {
    return res.json(await this.gamesService.findById(id));
  }

  @Post()
  @ApiBody({ type: Game })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @UsePipes(new ValibotValidationPipe(SaveGameDTO))
  async save(@Res() res: Response, @Body() game: IGame) {
    console.log(game);

    return res.json(await this.gamesService.save(game));
  }

  // PUT /games/:id
  @Put(':id')
  @ApiBody({ type: UpdateGame })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  async replace(
    @Res() res: Response,
    @Param('id') id: string,
    @Body(new ValibotValidationPipe(SaveGameDTO)) game: IGame,
  ) {
    return res.json(await this.gamesService.replace(id, game));
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully deleted',
  })
  async delete(@Res() res: Response, @Param('id') id: string) {
    return res.json(await this.gamesService.delete(id));
  }
}
