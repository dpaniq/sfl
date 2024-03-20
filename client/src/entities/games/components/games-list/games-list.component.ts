import {
  ChangeDetectionStrategy,
  Component,
  signal,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { totalWeeksByYear } from '@entities/utils/date';
import { GameCardComponent } from '../game-card/game-card.component';
import { getGameCards } from '@entities/utils/games';
import { IGame, TGameCard } from '@entities/games/types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { GameService } from '@entities/games/services/game.service';
import { addWeeks, getDate, getYear, nextSaturday, setDay } from 'date-fns';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { range } from 'lodash';
import { EnumGameStatus } from '@entities/games/constants';

const weeks = totalWeeksByYear(new Date());

function findSaturdayAfterDate(date: number, saturdayIdx: number) {
  // Add 3 weeks to get to the fourth week
  const fourthWeek = addWeeks(date, saturdayIdx);
  // Set the day to Saturday
  const fourthSaturday = setDay(fourthWeek, 6); // 6 represents Saturday
  // Get the date of the fourth Saturday
  return getDate(fourthSaturday);
}

@Component({
  selector: 'sfl-games-list',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    GameCardComponent,
    MatProgressBarModule,
  ],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly gameService = inject(GameService);

  private readonly loading = signal<boolean>(false);
  readonly season = signal(2023);

  readonly gameCards = signal<TGameCard[]>([]);

  // TODO need year/gameOfYear resolver

  constructor() {
    this.season.set(getYear(new Date()));

    toObservable(this.season)
      .pipe(
        tap(() => {
          this.loading.set(true);
        }),
        switchMap((season: number) => {
          return this.gameService.find({ season });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(games => {
        this.loading.set(false);

        const date = new Date(`${this.season()}-11-01`);
        const newGames: TGameCard[] = [];
        for (const number of range(1, weeks)) {
          const numberSaturdayDate = nextSaturday(date);

          const found = games.find(game => game.number === number);

          if (found) {
            newGames.push(found);
          } else {
            newGames.push({
              number,
              season: this.season(),
              playedAt: numberSaturdayDate,
              status: EnumGameStatus.Furture,
            });
          }
        }

        // Set played and furture games
        this.gameCards.set(newGames);
      });
  }

  ngOnInit() {}
}
