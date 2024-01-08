import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameCreateComponent } from 'src/features/games';

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
})
export class GameCreationWidgetComponent {}
