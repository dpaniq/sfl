import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'sfl-captains-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTabsModule],
  templateUrl: './captains-page.component.html',
  styleUrls: ['./captains-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptainsPageComponent {}
