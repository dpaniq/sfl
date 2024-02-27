import { Injectable, PipeTransform } from '@nestjs/common';

import * as v from 'valibot';

@Injectable()
export class ValibotValidationPipe implements PipeTransform {
  constructor(private schema: v.BaseSchema) {}

  transform(value: any) {
    return v.parse(this.schema, value);
  }
}
