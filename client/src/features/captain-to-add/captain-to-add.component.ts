import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf, JsonPipe, AsyncPipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import {
  BehaviorSubject,
  Subject,
  combineLatest,
  debounceTime,
  startWith,
  takeUntil,
  tap,
} from 'rxjs';

import {
  CaptainCardComponent,
  CaptainsCardsComponent,
  CaptainsStore,
  TCaptain,
} from 'src/entities/captains';

import { provideComponentStore } from '@ngrx/component-store';
import { PlayersStore } from 'src/entities/players';
import {
  displayFn,
  hasSuggestedFilter,
} from '../../entities/captains/utils/autocomplete';
import { BaseUnsubscribeComponent } from 'src/shared/classes/base-unsubscribe-component';
import { TPlayer } from 'src/entities/players/types';
import { CardVariantEnum } from '@shared/constants/card';

@Component({
  standalone: true,
  selector: 'sfl-captain-to-add',
  templateUrl: './captain-to-add.component.html',
  styleUrls: ['./captain-to-add.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatRadioModule,
    FormsModule,
    NgFor,
    NgIf,
    JsonPipe,
    AsyncPipe,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    CaptainCardComponent,
    CaptainsCardsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [
  //   provideComponentStore(CaptainsStore),
  //   provideComponentStore(PlayersStore),
  // ],
})
export class CaptainToAddComponent extends BaseUnsubscribeComponent {
  constructor(
    private captainsStore: CaptainsStore,
    private playersStore: PlayersStore
  ) {
    super();
  }

  readonly displayFn = displayFn;
  readonly variantEnum = CardVariantEnum;
  readonly players$ = this.playersStore.players$;
  readonly captains$ = this.captainsStore.captains$;
  readonly captainFormControl = new FormControl<TCaptain | string | null>('');

  readonly #filteredPlayers = new BehaviorSubject<TPlayer[]>([]);
  readonly filteredPlayers$ = this.#filteredPlayers.asObservable();

  readonly loading$ = new Subject();

  @HostListener('click', ['$event.target'])
  handleClick(target: Element) {
    const captainEl = target.closest('sfl-captain-card');
    if (!captainEl) {
      return;
    }
    const id = captainEl.getAttribute('data-captain-id');
    id && this.captainsStore.delete(id);
  }

  ngOnInit() {
    combineLatest([
      this.playersStore.players$,
      this.captainsStore.captains$,
      this.captainFormControl.valueChanges.pipe(startWith(null)),
    ])
      .pipe(
        tap(() => this.loading$.next(true)),
        debounceTime(1500),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(([players, captains, suggestedCaptain]) => {
        this.loading$.next(false);

        if (!suggestedCaptain) {
          return this.#filteredPlayers.next(players);
        }

        // Todo [API]: in the future it should use API
        if (typeof suggestedCaptain === 'string') {
          const captainsIds = captains.map(({ id }) => id);
          return this.#filteredPlayers.next(
            players.filter(
              (player) =>
                !captainsIds.includes(player.id) &&
                hasSuggestedFilter(player, suggestedCaptain)
            )
          );
        }

        // Todo [API]: in the future it should use API
        this.captainFormControl.reset();
        this.captainsStore.add({
          ...suggestedCaptain,
          captain: true,
        });
      });
  }
}
