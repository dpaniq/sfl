import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ITeam, Team } from './team.schema';
import { Model } from 'mongoose';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name)
    private teamModel: Model<ITeam>,
  ) {}

  async get() {
    return await this.teamModel.find();
  }

  async save(team: ITeam) {
    console.log('BEFORE SAVE TEAM', JSON.stringify(team, null, 2));

    const saveGame = await this.teamModel.create(team);
  }
}
