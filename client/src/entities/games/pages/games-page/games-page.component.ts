import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { GamesTableComponent } from 'src/features/games-table/games-table.component';
import { CaptainsService, CaptainsStore } from '@entities/captains';
import { provideComponentStore } from '@ngrx/component-store';
import { GameCreationWidgetComponent } from '@entities/games/widgets/game-creation-widget/game-creation-widget.component';
import { PlayersService } from '@entities/players/services/players.service';
import { GamesListComponent } from '@entities/games/components/games-list/games-list.component';
import { RouterOutlet } from '@angular/router';
import { GameService } from '@entities/games';

@Component({
  selector: 'sfl-games-page',
  standalone: true,
  imports: [
    RouterOutlet,
    // Material
    MatIconModule,
    MatTabsModule,

    // Component
    // GamesTableComponent,
    GameCreationWidgetComponent,
    GamesListComponent,
  ],
  templateUrl: './games-page.component.html',
  styleUrl: './games-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Fixme: CaptainsStore uses CaptainsService, idk how to fix this
    // https://angular.io/api/core/FactoryProvider
    // CaptainsService,
    // PlayersService,

    // To use CaptainsService - useEffects
    // provideComponentStore(CaptainsStore),

    GameService,
  ],
})
export class GamesPageComponent {
  user: { isAdmin: boolean } = { isAdmin: true };

  // TODO resolved to go in
}
