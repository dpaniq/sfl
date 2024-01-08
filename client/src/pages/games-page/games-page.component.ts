import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { GamesTableComponent } from 'src/features/games-table/games-table.component';
import { CaptainsService, CaptainsStore } from '@entities/captains';
import { provideComponentStore } from '@ngrx/component-store';
import { GameCreationWidgetComponent } from 'src/widgets/game-creation-widget/game-creation-widget.component';

@Component({
  selector: 'sfl-games-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,

    // Component
    GamesTableComponent,
    GameCreationWidgetComponent,
  ],
  templateUrl: './games-page.component.html',
  styleUrl: './games-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Fixme: CaptainsStore uses CaptainsService, idk how to fix this
    // https://angular.io/api/core/FactoryProvider
    CaptainsService,

    // To use CaptainsService - useEffects
    provideComponentStore(CaptainsStore),
  ],
})
export class GamesPageComponent {
  user: { isAdmin: boolean } = { isAdmin: true };
}
