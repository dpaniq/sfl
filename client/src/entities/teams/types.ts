import { EnumTeamColor } from './constants';

export interface ITeam {
  _id: string;
  name: string;
  color: EnumTeamColor;
  description?: string;
}
