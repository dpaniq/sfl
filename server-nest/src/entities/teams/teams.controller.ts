import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { ITeam, Team, UpdateTeam } from './team.schema';
import { SaveGameDTO } from '../games/game.dto';
import { ValibotValidationPipe } from 'src/shared/pipes/custom-pipe/valibot-validation.pipe';
import { UpdateGame } from '../games/game.schema';
import { SaveTeamDTO } from './team.dto';
import { Response } from 'express';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all teams records',
  })
  async find(@Res() res: Response) {
    return res.json(await this.teamsService.find());
  }

  @Post()
  @ApiBody({ type: Team })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
  })
  @UsePipes(new ValibotValidationPipe(SaveTeamDTO))
  async save(@Body() team: ITeam) {
    console.log(team);

    await this.teamsService.save(team);

    return { success: 'OK' };
  }

  // PUT /games/:id
  @Put(':id')
  @ApiBody({ type: UpdateTeam })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateGame) {
    // Update logic
  }
}
