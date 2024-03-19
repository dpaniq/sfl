import * as v from 'valibot';
import { Auth } from './auth.schema';

const AuthValiSchema = v.object<Record<keyof Auth, any>>({
  email: v.string([]),
  password: v.string([]),
});

export const AuthRequiredValiSchema = v.required(AuthValiSchema);
export type AuthRequiredValiSchemaInput = v.Input<
  typeof AuthRequiredValiSchema
>;
export type AuthRequiredValiSchemaOutput = v.Output<
  typeof AuthRequiredValiSchema
>;
// export type RequiredAuthDto = v.Input<typeof authDtoRequired>;

// export type UpdateTestUsersDtoInput = v.Input<typeof UpdateTestUsersDto>;
// export type UpdateTestUsersDtoOutput = v.Output<typeof UpdateTestUsersDto>;
