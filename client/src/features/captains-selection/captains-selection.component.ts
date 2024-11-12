import { CardVariantEnum } from '@shared/constants/card';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';

import { CaptainStatsCardComponent, CaptainsStore } from '@entities/captains';
import { BaseUnsubscribeComponent } from '@shared/classes/base-unsubscribe-component';
import { provideComponentStore } from '@ngrx/component-store';
import { TeamEnum } from '@shared/constants/team';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'sfl-captains-selection',
  templateUrl: './captains-selection.component.html',
  styleUrls: ['./captains-selection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, MatButtonModule, CaptainStatsCardComponent],
  // providers: [provideComponentStore(CaptainsStore)],
})
export class CaptainsSelectionComponent extends BaseUnsubscribeComponent {
  constructor(private captainsStore: CaptainsStore) {
    super();
  }

  @Input() team!: TeamEnum;
  @Input() control!: FormControl<boolean | null>;

  readonly cardVariantEnum = CardVariantEnum;
  readonly captains$ = this.captainsStore.captains$;
  readonly captainsWithoutTeam$ = this.captainsStore.captainsWithoutTeam$;

  readonly selectedCaptain$ = this.captainsStore.selectedCaptains$.pipe(
    map((selected) => selected.filter((select) => select.team === this.team)),
    map((selected) => selected[0] ?? null)
  );

  @HostListener('click', ['$event.target'])
  handleClick(target: Element) {
    const captainEl = target.closest('sfl-captain-stats-card');
    if (!captainEl) {
      return;
    }

    const id = captainEl.getAttribute('data-captain-id');
    id && this.captainsStore.addSelected({ id, team: this.team });
    this.control.patchValue(true);
  }

  deleteSelected(id: string) {
    this.captainsStore.deleteSelected(id);
    this.control.patchValue(false);
  }
}
