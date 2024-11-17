import * as v from 'valibot';
import { EnumGameStatus } from './game.schema';

export const SavePlayerStatisticDTO = v.object({
  playerId: v.string([v.toTrimmed()]), //mongoose.Schema.ObjectId
  teamId: v.string([v.toTrimmed()]), //  mongoose.Schema.ObjectId
  goalsByLeg: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  goalsByHead: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  goalsByAuto: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  goalsByPenalty: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  passes: v.optional(v.number([v.integer(), v.minValue(0)]), 0),
  mvp: v.optional(v.boolean(), false),
  isMVP: v.optional(v.boolean(), false),
  isTransfer: v.optional(v.boolean(), false),
  isCaptain: v.optional(v.boolean(), false),
});

export const SaveGameDTO = v.transform(
  v.object({
    number: v.number([v.integer(), v.minValue(1), v.maxValue(53)]),
    season: v.number([v.integer(), v.minValue(2010)]),
    playedAt: v.string([v.isoTimestamp()]),
    status: v.enum_(EnumGameStatus),
    teams: v.array(v.any()),
    statistics: v.array(SavePlayerStatisticDTO),
  }),
  (input) => ({
    ...input,
  }),
);

export const UpdateGameDTO = v.transform(
  v.object({
    id: v.string([v.toTrimmed()]),
    number: v.number([v.integer(), v.minValue(1), v.maxValue(53)]),
    season: v.number([v.integer(), v.minValue(2010)]),
    playedAt: v.string([v.isoTimestamp()]),
    status: v.enum_(EnumGameStatus),
    teams: v.array(v.any()),
    statistics: v.array(SavePlayerStatisticDTO),
  }),
  (input) => ({
    ...input,
  }),
);

export type SaveGameDTOInput = v.Input<typeof SaveGameDTO>;
export type SaveGameDTOOutput = v.Output<typeof SaveGameDTO>;

export type UpdateGameDTOInput = v.Input<typeof SaveGameDTO>;
