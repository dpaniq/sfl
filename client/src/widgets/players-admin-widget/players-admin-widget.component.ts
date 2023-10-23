import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'sfl-players-admin-widget',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,

    // Feature
  ],
  templateUrl: './players-admin-widget.component.html',
  styleUrls: ['./players-admin-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersAdminWidgetComponent {}
