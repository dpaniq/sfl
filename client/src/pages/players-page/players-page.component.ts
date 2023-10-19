import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { PlayersTableComponent } from '@features';

@Component({
  selector: 'sfl-players-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,

    // Features
    PlayersTableComponent,
  ],
  templateUrl: './players-page.component.html',
  styleUrls: ['./players-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersPageComponent {}
