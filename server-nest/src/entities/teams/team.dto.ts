import * as v from 'valibot';
import { EnumTeamColor } from './team.schema';

export const SaveTeamDTO = v.transform(
  v.object({
    name: v.string([v.toTrimmed(), v.minLength(3)]),
    color: v.enum_(EnumTeamColor),
    description: v.optional(v.string([v.toTrimmed()])),
    logo: v.optional(v.string([v.toTrimmed()])),
  }),
  (input) => ({
    ...input,
  }),
);

export type SaveTeamDTOInput = v.Input<typeof SaveTeamDTO>;
export type SaveTeamDTOOutput = v.Output<typeof SaveTeamDTO>;
