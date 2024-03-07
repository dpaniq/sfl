import { ApiProperty } from '@nestjs/swagger';

export interface IAuth {
  email: string;
  password: string;
}

export class Auth implements IAuth {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
