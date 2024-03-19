import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  firstValueFrom,
  tap,
} from 'rxjs';
import { HttpService } from '@shared/services/http.service';
import { NewGameState } from '../store/new-game.store';
import { getYear } from 'date-fns';

@Injectable()
export class GameService {
  private readonly useMock = true;

  private readonly httpService = inject(HttpService);

  public save(playedAt: Date, game: NewGameState): any {
    const newGame = Object.assign(
      {},
      {
        playedAt,
        players: game.players.filter(({ team }) => !!team),
      },
    );

    this.httpService
      .post<any>(`games`, newGame)
      .pipe(
        tap(x => {
          console.log('saveGame', x);
        }),
      )
      .subscribe();
  }
}
