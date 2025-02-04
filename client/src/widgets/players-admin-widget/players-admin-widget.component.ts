import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PlayersToggleComponent } from '@features';

@Component({
  selector: 'sfl-players-admin-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,

    // Feature
    PlayersToggleComponent,
  ],
  templateUrl: './players-admin-widget.component.html',
  styleUrls: ['./players-admin-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // // To use CaptainsService - useEffects
    // provideComponentStore(PlayersStore),
  ],
})
export class PlayersAdminWidgetComponent {}
