import * as v from 'valibot';

const AuthValiSchema = v.object({
  login: v.string([]),
  password: v.string([]),
});

export const AuthRequiredValiSchema = v.required(AuthValiSchema);
export type AuthRequiredValiSchemaInput = v.Input<
  typeof AuthRequiredValiSchema
>;
// export type RequiredAuthDto = v.Input<typeof authDtoRequired>;

// export type UpdateTestUsersDtoInput = v.Input<typeof UpdateTestUsersDto>;
// export type UpdateTestUsersDtoOutput = v.Output<typeof UpdateTestUsersDto>;
