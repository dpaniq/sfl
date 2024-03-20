import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { CaptainsStore } from '@entities/captains';
import { PlayersStore } from '@entities/players';
import { GameCreateComponent, GameService } from '@entities/games';
import { PlayersService } from '@entities/players/services/players.service';

@Component({
  selector: 'sfl-game-creation-widget',
  standalone: true,
  imports: [
    CommonModule,
    // Custom
    GameCreateComponent,
  ],
  templateUrl: './game-creation-widget.component.html',
  styleUrl: './game-creation-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideComponentStore(CaptainsStore),
    provideComponentStore(PlayersStore),
    GameService,
    PlayersService,
  ],
})
export class GameCreationWidgetComponent {}
