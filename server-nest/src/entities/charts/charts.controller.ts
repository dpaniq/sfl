import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { ChartsService } from './charts.service';

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

@ApiTags('charts')
@Controller('charts')
export class ChartsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chartsService: ChartsService,
  ) {}

  @ApiOkResponse({ status: 200, type: Array })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get('players-ancient-rating-system-by-season/:season')
  async getPlayersSeasonsTotalPoints(
    @Param('season', new ParseIntPipe({ optional: true })) season: number,
  ): Promise<TResponse<any>> {
    try {
      return {
        data: await this.chartsService.getPlayersAncientRatingSystemBySeason(
          season,
        ),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Unexpected error occurred',
      );
    }
  }
}
