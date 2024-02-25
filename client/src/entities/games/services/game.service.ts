import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  firstValueFrom,
  tap,
} from 'rxjs';
import { HttpService } from '@shared/services/http.service';

@Injectable()
export class GameService {
  private readonly useMock = true;

  private readonly httpService = inject(HttpService);

  public save<T>(game: any) {
    return this.httpService.post<T>(`games/game`, game).pipe(
      tap(x => {
        console.log('saveGame', x);
      }),
    );
  }
}
