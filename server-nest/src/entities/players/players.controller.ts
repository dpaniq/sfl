import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ClientPlayer } from '.';
import { UsersService } from '../users/users.service';
import { Player } from './players.schema';
import { PlayersService } from './players.service';

export class PlayerCreationDTO {
  @ApiProperty({ required: true, type: String })
  nickname: string;
  number: number;

  @ApiProperty({ required: true })
  user: {
    email: string;
    name?: string;
    surname?: string;
  };
}

@ApiTags('player')
@Controller('players')
export class PlayersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly playersService: PlayersService,
  ) {}

  @ApiOkResponse({ status: 200, type: Player })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get(':id')
  async findById(@Param('id') id: string) {
    if (!id.trim()) {
      throw new BadRequestException('Id is empty');
    }

    try {
      const player = await this.playersService.findById(id);
      if (!player) {
        throw new NotFoundException('Player is not found');
      }
      return player;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Unexpected error occurred',
      );
    }
  }

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
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: ClientPlayer,
  ) {
    const { user: userBody, ...playerBody } = body;

    console.log('PATCH', id, { userBody, playerBody });

    const updatedUser = await this.usersService.patch(userBody.id, userBody);
    const updatedPlayer = await this.playersService.patch(
      req.params.id,
      playerBody,
    );

    console.log('PATCH', { updatedUser, updatedPlayer });

    return res.json(updatedPlayer);
  }

  @Post()
  @ApiBody({
    type: PlayerCreationDTO,
    required: true,
    isArray: true,
  })
  @ApiResponse({ type: Player, isArray: true, status: 200 })
  @ApiResponse({ type: String, status: 400, schema: { example: 'error' } })
  // @UsePipes(new ValibotValidationPipe(UpdateTestUsersDto))
  async create(
    @Body() players: PlayerCreationDTO[],
    @Res() res: Response,
  ): Promise<any> {
    // return this.usersService.getsUsers();

    // TODO all settled
    const createdPlayers = await Promise.all(
      players.map(async (player) => {
        const { user: userBody, ...playerBody } = player;

        const user = await this.usersService.createUser({
          name: userBody.name,
          surname: userBody.surname,
          email: userBody.email,
          roles: ['658ddee2f71a72e6d8ea95f8'], // TODO, check is USER ROLE,
        });

        return await this.playersService.create({
          ...playerBody,
          userId: user.id,
        });
      }),
    ).catch((e) => {
      console.log(e);
      return 'Upps. Something went wrong';
    });

    return res.json(createdPlayers);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Player, status: 200 })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request response with no content',
  })
  async delete(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    return res.json(await this.playersService.delete(id));
  }

  @Get('recalculate/season')
  @ApiOkResponse({ type: Player, status: 200 })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad request response with no content',
  })
  async recalculateSeason(
    @Query('seasonId', ParseIntPipe) seasonId: number,
    @Query('playerId') playerId: string,
  ) {
    return await this.playersService.recalculateSeasonMetadata(
      playerId,
      seasonId,
    );
  }
}
