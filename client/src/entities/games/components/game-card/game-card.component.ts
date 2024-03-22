import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TOTAL_GAMES_OF_YEAR } from '@entities/games/constants';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { isAfter, isBefore } from 'date-fns';
import { IGame, TGameCard } from '@entities/games/types';
import { EnumGameStatus } from '../../constants';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sfl-game-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  readonly router = inject(Router);
  readonly activatedRouter = inject(ActivatedRoute);

  public gameCard = input.required<TGameCard>();
  public readonly enumGameStatus = EnumGameStatus;

  public readonly TOTAL_GAMES_OF_YEAR = TOTAL_GAMES_OF_YEAR;

  public readonly hasGamePlayed = computed(() => {
    return this.gameCard
      ? isBefore(this.gameCard().playedAt, new Date())
      : false;
  });

  openDetails() {
    const { season, number } = this.gameCard();
    this.router.navigate(['games', season, number]);
  }

  createGame() {
    const { number, season, status, playedAt } = this.gameCard();

    this.router.navigate(['games', 'create'], {
      queryParams: { number, season, status, playedAt: playedAt.toISOString() },
    });
  }

  edit() {
    const { id, number, season, status, playedAt } = this.gameCard();
    console.log(id);

    this.router.navigate(['games', 'edit', id]);
  }
}
