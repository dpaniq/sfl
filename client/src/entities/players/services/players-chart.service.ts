import { Injectable, inject } from '@angular/core';
import { IPlayerDTO } from '@entities/games/types';
import { HttpService } from '@shared/services/http.service';

type ResponseCaptains = {
  players: IPlayerDTO[];
  page: number;
};

export type PlayersResponse = {
  players: IPlayerDTO[];
  page: number;
};

@Injectable()
export class PlayersChartService {
  #httpService = inject(HttpService);
}
