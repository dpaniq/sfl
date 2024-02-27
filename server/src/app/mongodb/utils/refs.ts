import {ObjectId, Schema} from 'mongoose';
import {EnumRoleCollection, RoleModel} from '../model/role.model';
import {EnumUserCollection, IUser, UserModel} from '../model/user.model';
import {EnumPlayerCollection, PlayerModel} from '../model/player.model';
import {EnumTeamCollection, TeamModel} from '../model/team.model';

export function useRoleModelReference(
  collection: EnumRoleCollection,
  model: typeof RoleModel,
) {
  return {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: collection,
        required: true,
      },
    ],
    validate: {
      validator: async (array: any[]) => {
        const rolesCount = await model.countDocuments({_id: {$in: array}});
        return (
          Array.isArray(array) &&
          array.length > 0 &&
          array.length === rolesCount
        );
      },
      message: 'At least one role is required.',
    },
  };
}

export function useUserModelReference(
  collection: EnumUserCollection,
  model: typeof UserModel,
  required = true,
) {
  return {
    type: Schema.Types.UUID,
    ref: collection,
    required,
    validate: {
      validator: async (uuid: any) => {
        return !!(await model.findById(uuid));
      },
      message: 'No user is found',
    },
  };
}

export function useTeamModelReference(
  collection: EnumTeamCollection,
  model: typeof TeamModel,
  required = true,
) {
  return {
    type: Schema.Types.ObjectId,
    ref: collection,
    required,
    validate: {
      validator: async (teamId: any) => {
        return !!(await model.findById(teamId));
      },
      message: 'No team is found',
    },
  };
}

export function usePlayerModelReference(
  collection: EnumPlayerCollection,
  model: typeof PlayerModel,
  required: boolean = true,
) {
  return {
    type: Schema.Types.ObjectId,
    ref: collection,
    required,
    validate: {
      validator: async (playerId: any) => {
        return !!(await model.findById(playerId));
      },
      message: 'No player is found',
    },
  };
}
