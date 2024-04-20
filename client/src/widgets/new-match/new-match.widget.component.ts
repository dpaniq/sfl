import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import {
  CaptainCardComponent,
  CaptainsCardsComponent,
  CaptainsService,
  CaptainsStore,
  TCaptain,
} from '@entities/captains';
import { PlayersStore } from '@entities/players';
import {
  CaptainToAddComponent,
  CaptainsSelectionComponent,
  PlayersSelectionComponent,
} from '@features';
import { provideComponentStore } from '@ngrx/component-store';
import { CardVariantEnum } from '@shared/constants/card';
import { TeamEnum } from '@shared/constants/team';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

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
    MatDividerModule,
    MatIconModule,
    CaptainCardComponent,
    CaptainsCardsComponent,
    CaptainToAddComponent,
    CaptainsSelectionComponent,
    PlayersSelectionComponent,
  ],
  providers: [CaptainsService, provideComponentStore(CaptainsStore)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewMatchWidgetComponent implements OnInit {
  readonly playersStore = inject(PlayersStore);

  readonly captains$ = this.captainsStore.captains$;
  readonly playersSignal = this.playersStore.players;

  isEditable = false;
  isLinear = false;
  optionalLabelText!: string;
  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  captainsFormGroup = this._formBuilder.group({
    firstCaptain: [null, Validators.required],
    secondCaptain: [null, Validators.required],
  });

  playersFormControl = new FormControl<boolean>(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private readonly captainsStore: CaptainsStore,
  ) {}

  readonly variantEnum = CardVariantEnum;
  readonly teamEnum = TeamEnum;

  options_ = new BehaviorSubject<TCaptain[]>([]);
  options$ = this.options_.asObservable();

  readonly unsubscribe$ = new Subject<void>();

  myControl = new FormControl<TCaptain | string>('');

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.captainsStore.captains$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(captains =>
        console.log('WE GET CAPTAINS FROM STORE', captains),
      );
  }
}
