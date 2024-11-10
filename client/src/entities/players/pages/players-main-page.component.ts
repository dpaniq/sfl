import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { CaptainsService } from '@entities/captains';
import { PlayersStore } from '@entities/players';
import { PlayerCreateButtonComponent } from '@entities/players/components/player-create-button/player-create-button.component';
import { PlayersTableComponent } from '@entities/players/components/players-table/players-table.component';
import { PlayersService } from '@entities/players/services/players.service';
import { PlayersAdminWidgetComponent } from '@widgets';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatDividerModule,

    // Features
    PlayersTableComponent,
    PlayerCreateButtonComponent,

    // Widgets
    PlayersAdminWidgetComponent,
  ],
  styles: `
    :host {
      .tab-container {
        margin: 12px 24px;

        > .tab-header {
          display: flex;
          justify-content: flex-end;
        }

        > .tab-content {
          margin: 12px 0;
        }
      }
    }
  `,
  template: `
    <h1>Players</h1>
    <mat-divider></mat-divider>
    <br />

    <div class="tab-container">
      <div class="tab-header">
        <sfl-player-create-button />
      </div>

      <div class="tab-content">
        <sfl-players-table></sfl-players-table>
      </div>
    </div>

    <!-- <mat-tab-group>
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon fontIcon="list"></mat-icon>
          List of players
        </ng-template>

        <div class="tab-container">
          <div class="tab-header">
            <sfl-player-create-button />
          </div>

          <div class="tab-content">
            <sfl-players-table></sfl-players-table>
          </div>
        </div>
      </mat-tab>

      <mat-tab *ngIf="user.isAdmin">
        <ng-template mat-tab-label>
          <mat-icon fontIcon="manage_accounts"></mat-icon>
          Admin panel
        </ng-template>

        <sfl-players-admin-widget></sfl-players-admin-widget>
      </mat-tab>
    </mat-tab-group> -->
  `,
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
export class PlayersMainPageComponent {
  // @temporary
  // TODO JWT
  user: { isAdmin: boolean } = { isAdmin: true };
}
