import { ApiProperty } from '@nestjs/swagger';

export interface IAuth {
  login: string;
  password: string;
}

export class AuthModel implements IAuth {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;
}
