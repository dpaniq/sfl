import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Injectable,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  NgModel,
  FormControl,
} from '@angular/forms';
import { MatStepperIntl, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf, JsonPipe, AsyncPipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  CaptainCardComponent,
  CaptainsCardsComponent,
  CaptainsService,
  CaptainsStore,
  Variant,
} from 'src/entities/captains';

import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  of,
  startWith,
  takeUntil,
} from 'rxjs';
import { TCaptain } from 'src/entities/captains/types';
import { provideComponentStore } from '@ngrx/component-store';
import { PlayersStore } from 'src/entities/players';
import { CaptainToAddComponent } from 'src/features';

@Component({
  standalone: true,
  selector: 'sfl-new-match-widget',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './new-match.widget.component.html',
  styleUrls: ['./new-match.widget.component.css'],
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
    CaptainCardComponent,
    CaptainsCardsComponent,
    CaptainToAddComponent,
  ],
  providers: [
    CaptainsService,
    provideComponentStore(CaptainsStore),
    provideComponentStore(PlayersStore),
  ],
})
export class NewMatchWidgetComponent implements OnInit {
  readonly captains$ = this.captainsStore.captains$;
  readonly players$ = this.playersStore.players$;

  isEditable = false;
  isLinear = false;
  optionalLabelText!: string;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private captainsService: CaptainsService,
    private readonly captainsStore: CaptainsStore,
    private readonly playersStore: PlayersStore
  ) {}

  readonly variantEnum = Variant;

  public readonly captainsToAdd$ = this.captainsService.captainsToAdd$;
  public readonly choosenCaptains$ = this.captainsService.choosenCaptains_s$;
  public readonly availableTeams$ = this.captainsService.availableTeams$;

  options_ = new BehaviorSubject<TCaptain[]>([]);
  options$ = this.options_.asObservable();

  readonly unsubscribe$ = new Subject<void>();

  myControl = new FormControl<TCaptain | string>('');

  @HostListener('click', ['$event.target'])
  handleClick(target: Element) {
    const captainEl = target.closest('sfl-captain-card');
    if (captainEl) {
      const id = captainEl.getAttribute('data-captain-id');
      console.log(id);
      id &&
        this.availableTeams$().length &&
        this.captainsService.toggleChoosenCaptains(
          id,
          this.availableTeams$()[0]
        );

      id && this.captainsStore.delete(id);
    }
  }

  removeCaptain(id: string) {
    this.captainsService.removeCaptain(id);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.captainsStore.captains$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((captains) =>
        console.log('WE GET CAPTAINS FROM STORE', captains)
      );

    console.log(this.captainsStore.captains$);

    console.log('t2', this.captainsToAdd$(), this.options_.value);
  }
}
