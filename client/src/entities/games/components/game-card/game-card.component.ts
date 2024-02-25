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
import { GameCard } from '../../types';
import { isAfter, isBefore } from 'date-fns';

@Component({
  selector: 'sfl-game-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  readonly router = inject(Router);
  readonly activatedRouter = inject(ActivatedRoute);

  public gameCard = input.required<GameCard>();

  public readonly TOTAL_GAMES_OF_YEAR = TOTAL_GAMES_OF_YEAR;

  public readonly hasGamePlayed = computed(() => {
    return this.gameCard
      ? isBefore(this.gameCard().gameDate, new Date())
      : false;
  });

  openDetails() {
    const { season, gameIdx } = this.gameCard();
    this.router.navigate(['games', season, gameIdx]);
  }
}
