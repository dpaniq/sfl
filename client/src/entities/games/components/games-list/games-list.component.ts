import {
  ChangeDetectionStrategy,
  Component,
  signal,
  OnInit,
} from '@angular/core';
import { totalWeeksByYear } from '@entities/utils/date';
import { GameCardComponent } from '../game-card/game-card.component';
import { getGameCards } from '@entities/utils/games';
import { GameCard } from '@entities/games/types';

const weeks = totalWeeksByYear(new Date());

@Component({
  selector: 'sfl-games-list',
  standalone: true,
  imports: [GameCardComponent],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesListComponent implements OnInit {
  readonly year = 2023;
  readonly gameOfYear = 1;
  readonly totalGames = signal<GameCard[]>(getGameCards(this.year));

  // TODO need year/gameOfYear resolver

  constructor() {}

  ngOnInit() {}
}
