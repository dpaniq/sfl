import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { provideComponentStore } from '@ngrx/component-store';

import { CaptainsService, CaptainsStore } from '@entities/captains';
import { CaptainsTableComponent, CaptainsToggleComponent } from '@features';
import { CaptainsAdminWidgetComponent } from '@widgets';

@Component({
  selector: 'sfl-captains-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,

    // Features
    CaptainsTableComponent,
    CaptainsToggleComponent,

    // Widgets
    CaptainsAdminWidgetComponent,
  ],
  templateUrl: './captains-page.component.html',
  styleUrls: ['./captains-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Fixme: CaptainsStore uses CaptainsService, idk how to fix this
    // https://angular.io/api/core/FactoryProvider
    CaptainsService,

    // To use CaptainsService - useEffects
    provideComponentStore(CaptainsStore),
  ],
})
export class CaptainsPageComponent {
  // @temporary
  // TODO JWT
  user: { isAdmin: boolean } = { isAdmin: true };
}
