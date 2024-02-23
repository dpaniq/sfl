import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TOTAL_GAMES_OF_YEAR } from '@entities/games/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sfl-game-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  public gameIdx = input.required<number>();
  public gameDate = input.required<Date>();

  readonly TOTAL_GAMES_OF_YEAR = TOTAL_GAMES_OF_YEAR;
}
