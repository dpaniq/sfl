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
import { IGame } from '../types';

@Injectable()
export class GameService {
  private readonly useMock = true;

  private readonly httpService = inject(HttpService);

  public find(filter: Partial<IGame>): Observable<IGame[]> {
    return this.httpService.get<IGame[]>('games', filter);
  }

  public save(game: IGame) {
    return this.httpService.post<IGame>(`games`, game);
  }

  public resave(id: string, game: IGame) {
    return this.httpService.put<IGame>(`games/${id}`, game);
  }
}
