declare global {
  namespace Express {
    // These open interfaces may be extended in an application-specific manner via declaration merging.
    // See for example method-override.d.ts (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts)
    export interface Request {
      user?: Partial<import('./entities/users').User>; // Define your custom property
      cookies?: {};
    }
    interface Response {}
    interface Locals {}
    interface Application {}
  }
}

type WithId<T> = T & { id: string };
