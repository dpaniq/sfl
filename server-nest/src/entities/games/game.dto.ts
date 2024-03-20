import * as v from 'valibot';
import { EnumGameStatus, IPlayerStatistic } from './game.schema';
import { Schema } from 'mongoose';

export const SavePlayerStatisticDTO = v.object({
  playerId: v.string([v.toTrimmed()]), //mongoose.Schema.ObjectId
  teamId: v.string([v.toTrimmed()]), //  mongoose.Schema.ObjectId
  goal: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  goalHead: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  autoGoal: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  penalty: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  mvp: v.optional(v.boolean(), false),
});

export const SaveGameDTO = v.transform(
  v.object({
    number: v.number([v.integer(), v.minValue(1), v.maxValue(53)]),
    season: v.number([v.integer(), v.minValue(2010)]),
    playedAt: v.string([v.isoTimestamp()]),
    status: v.enum_(EnumGameStatus),
    statistics: v.array(SavePlayerStatisticDTO),
  }),
  (input) => ({
    ...input,
  }),
);

export type SaveGameDTOInput = v.Input<typeof SaveGameDTO>;
export type SaveGameDTOOutput = v.Output<typeof SaveGameDTO>;
