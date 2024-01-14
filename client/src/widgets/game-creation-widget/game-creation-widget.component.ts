import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCreateComponent } from 'src/features/games';
import { provideComponentStore } from '@ngrx/component-store';
import { CaptainsStore } from '@entities/captains';
import { PlayersStore } from '@entities/players';

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
  ],
})
export class GameCreationWidgetComponent {}
