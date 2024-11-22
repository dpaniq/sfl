import { Injectable, PipeTransform } from '@nestjs/common';

import * as v from 'valibot';

@Injectable()
export class ValibotValidationPipe implements PipeTransform {
  constructor(private schema: v.BaseSchema) {}

  transform(value: any) {
    try {
      return v.parse(this.schema, value);
    } catch (error) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const issues = (error as { issues: unknown }).issues;
        console.error('Validation issues:', JSON.stringify(issues, null, 2));
        // Output:
        // Validation issues: [
        //   { path: "id", message: "Invalid UUID format", code: "invalid_string" },
        //   { path: "name", message: "String must have at least 3 characters", code: "too_small" }
        // ]
        return error;
      } else {
        throw error; // Re-throw unexpected errors
      }
    }
  }
}
