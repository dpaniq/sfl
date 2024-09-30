import { Body, Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import {
  ApiBody,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ClientPlayer } from '.';
import { UsersService } from '../users/users.service';
import { Player } from './players.schema';
import { PlayersService } from './players.service';

export class PlayerCreationDTO {
  @ApiProperty({ required: true, type: String, uniqueItems: true })
  email: string;
  @ApiProperty({ required: true, type: String })
  nickname: string;
  @ApiPropertyOptional()
  name?: string;
  @ApiPropertyOptional()
  surname?: string;
}

@ApiTags('player')
@Controller('players')
export class PlayersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly playersService: PlayersService,
  ) {}

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
    @Body() body: ClientPlayer,
  ) {
    // const player = await this.playersService.updateInfo(req.params.id, body);
    // return res.json(player);
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
        const user = await this.usersService.createUser({
          name: player.name ?? 'test',
          surname: player.surname ?? 'test',
          email:
            player.email ?? 'test' + Math.random().toString() + '@test.com',
          roles: ['658ddee2f71a72e6d8ea95f8'],
        });

        return await this.playersService.create({
          nickname: player.nickname,
          userId: user.id,
        });
      }),
    ).catch((e) => {
      console.log(e);
      return 'Upps. Something went wrong';
    });

    return res.json(createdPlayers);
  }
}
