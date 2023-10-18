import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { CaptainsTableComponent } from '@features';

@Component({
  selector: 'sfl-captains-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,

    // Features
    CaptainsTableComponent,
  ],
  templateUrl: './captains-page.component.html',
  styleUrls: ['./captains-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptainsPageComponent {}
