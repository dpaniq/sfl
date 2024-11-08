import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TOTAL_GAMES_OF_YEAR } from '@entities/games/constants';
import { TGameFinalWithoutStatistics } from '@entities/games/types';
import { isBefore } from 'date-fns';
import { EnumGameStatus } from '../../constants';

@Component({
  selector: 'sfl-game-card',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  readonly router = inject(Router);
  readonly activatedRouter = inject(ActivatedRoute);

  public gameCard = input.required<TGameFinalWithoutStatistics>();
  public readonly enumGameStatus = EnumGameStatus;

  public readonly TOTAL_GAMES_OF_YEAR = TOTAL_GAMES_OF_YEAR;

  public readonly hasGamePlayed = computed(() => {
    console.log({ gamlet: this.gameCard() });

    return this.gameCard
      ? isBefore(this.gameCard().playedAt, new Date())
      : false;
  });

  protected readonly wonTeamClass = computed(() => {
    return this.gameCard().metadata?.isTeamFromFirstDraftWon === true
      ? this.gameCard().teams[0].name
      : this.gameCard().teams[1].name;
  });

  protected readonly teamNamesByDraft = computed(() => {
    return {
      firstDraft: this.gameCard().teams[0].name,
      secondDraft: this.gameCard().teams[1].name,
    };
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
