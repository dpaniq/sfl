import {
  Injectable,
  InternalServerErrorException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FlattenMaps, Model, Types } from 'mongoose';
import { FileLoggerService } from 'src/shared/services/logger.service';
import { Game, IGame } from '../games/game.schema';
import { UsersService } from '../users/users.service';
import {
  IPlayerMetadata,
  METADATA_DEFAULT,
} from './constants/player-career-metadata';
import { Player, ServerPlayer } from './players.schema';
import { accumulatePlayerCareerMetadata } from './utils/player-career-metadata';
import { accumulatePlayerSeasonMetadata } from './utils/player-season-metadata';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private playerModel: Model<Player>,

    @InjectModel(Game.name)
    private gameModel: Model<IGame>,

    @Optional()
    private usersService: UsersService,

    private readonly logger: FileLoggerService,
  ) {}

  async findById(id: string): Promise<ServerPlayer> {
    return (
      await this.playerModel.findById(id).populate('user').exec()
    ).toJSON();
  }

  async find(
    { ids }: { ids?: Types.ObjectId[] },
    includeMetadata = false,
  ): Promise<ServerPlayer[]> {
    const excludeFields = [includeMetadata ? '' : '-metadata'];

    return await this.playerModel
      .find({
        ...(ids ? { _id: { $in: ids } } : {}),
      })
      .select(excludeFields.join(' '))
      .populate('user')
      .exec();
  }

  async findCaptains(): Promise<ServerPlayer[]> {
    return await this.playerModel
      .find({ isCaptain: true })
      .populate('user')
      .exec();
  }

  async patch(
    id: string,
    player: Partial<ServerPlayer>,
  ): Promise<ServerPlayer | null> {
    try {
      await this.playerModel
        .findByIdAndUpdate({ _id: id }, { $set: { ...player } })
        .exec();
      return await this.playerModel.findById(id).populate('user').exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async create(player: {
    nickname: string;
    userId: string | Types.UUID;
    number: number;
  }): Promise<any> {
    try {
      const { id } = await this.playerModel.create({
        nickname: player.nickname,
        user: new mongoose.Types.UUID(player.userId),
        number: player.number,
      });

      return await this.playerModel.findById(id).populate('user').exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(id: string): Promise<ServerPlayer | null> {
    let deletedPlayer: ServerPlayer | null = null;
    try {
      deletedPlayer = await this.playerModel
        .findByIdAndDelete({ _id: id })
        .populate('user')
        .exec();

      const userId = deletedPlayer.user.id.toString()!;
      await this.usersService.deleteUserById(userId);

      return deletedPlayer;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async recalculatePlayersSeasonAndCareerMetadata(
    season: number,
    playerIds: string[],
  ): Promise<void> {
    try {
      playerIds.forEach(async (playerId) => {
        await this.recalculateSeasonMetadata(playerId, season);
      });
    } catch (error) {
      this.logger.error('Failed to recalculate season metadata for players', {
        season,
        playerIds,
        error,
      });

      throw InternalServerErrorException;
    }
  }

  private async recalculateSeasonMetadata(
    playerId: string,
    season: number,
  ): Promise<void> {
    this.logger.info('Recalculate season metadata for player', {
      _id: playerId,
      season,
    });
    const seasonData = (await this.gameModel.aggregate(
      [
        {
          $sort: {
            number: 1,
          },
        },
        {
          $match: {
            season,
            [`metadata.players.${playerId}`]: {
              $exists: 1,
              $ne: null,
            },
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true },
    )) as (IGame & { _id: Types.ObjectId })[];

    try {
      const seasonMetadata = seasonData
        .map((seasonGame) => ({
          ...seasonGame,
          id: seasonGame._id.toString(),
        }))
        .reduce((curr, game) => {
          const playerMetadata = game.metadata.players[playerId];
          return accumulatePlayerSeasonMetadata(curr, playerMetadata, game);
        }, METADATA_DEFAULT);

      await this.playerModel.updateOne(
        { _id: playerId },
        { $set: { [`metadata.bySeason.${season}`]: seasonMetadata } },
      );

      await this.recalculateCareerMetadata(playerId);
    } catch (error) {
      console.error(error);
      this.logger.error('Failed to recalculate season metadata for player', {
        _id: playerId,
        season,
        error,
      });
    }
  }

  protected async recalculateCareerMetadata(playerId: string): Promise<void> {
    const seasonsMetadata: FlattenMaps<Record<number, IPlayerMetadata>> =
      (await this.playerModel.findById({ _id: playerId }).exec()).toJSON()
        .metadata?.bySeason ?? {};

    try {
      const accumulatedPlayerCareerMetadata = Object.values(seasonsMetadata)
        // All numbers keys go in order
        // .sort(([seasonA], [seasonB]) => Number(seasonA) - Number(seasonB))
        // .map(([, metadata]) => metadata)
        .reduce((curr, seasonMetdata) => {
          return accumulatePlayerCareerMetadata(curr, seasonMetdata);
        }, METADATA_DEFAULT);

      await this.playerModel.updateOne(
        { _id: playerId },
        { $set: { 'metadata.byCareer': accumulatedPlayerCareerMetadata } },
      );
    } catch (error) {
      console.error(error);
      this.logger.error('Failed to recalculate career metadata for player', {
        _id: playerId,
        error,
      });
    }
  }
}
