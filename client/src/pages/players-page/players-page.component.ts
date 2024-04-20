import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { CaptainsService } from '@entities/captains';
import { PlayersStore } from '@entities/players';
import { PlayersService } from '@entities/players/services/players.service';
import { PlayersTableComponent } from '@features';
import { PlayersAdminWidgetComponent } from '@widgets';

@Component({
  selector: 'sfl-players-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,

    // Features
    PlayersTableComponent,

    // Widgets
    PlayersAdminWidgetComponent,
  ],
  templateUrl: './players-page.component.html',
  styleUrls: ['./players-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Fixme: CaptainsStore uses CaptainsService, idk how to fix this
    // https://angular.io/api/core/FactoryProvider
    CaptainsService,
    PlayersService,

    // Move to the widget
    // // To use CaptainsService - useEffects
    PlayersStore,
  ],
})
export class PlayersPageComponent {
  // @temporary
  // TODO JWT
  user: { isAdmin: boolean } = { isAdmin: true };
}
