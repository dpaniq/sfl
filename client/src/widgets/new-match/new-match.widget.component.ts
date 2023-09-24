import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf, JsonPipe, AsyncPipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideComponentStore } from '@ngrx/component-store';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import {
  CaptainCardComponent,
  CaptainsCardsComponent,
  CaptainsService,
  CaptainsStore,
  TCaptain,
} from '@entities/captains';
import { PlayersStore } from '@entities/players';
import { CaptainToAddComponent, CaptainsSelectionComponent } from '@features';
import { CardVariantEnum } from '@shared/constants/card';
import { TeamEnum } from '@shared/constants/team';

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
    CaptainsSelectionComponent,
  ],
  providers: [
    CaptainsService,
    provideComponentStore(CaptainsStore),
    provideComponentStore(PlayersStore),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  captainsFormGroup = this._formBuilder.group({
    firstCaptain: [null, Validators.required],
    secondCaptain: [null, Validators.required],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private captainsService: CaptainsService,
    private readonly captainsStore: CaptainsStore,
    private readonly playersStore: PlayersStore
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
      .subscribe((captains) =>
        console.log('WE GET CAPTAINS FROM STORE', captains)
      );
  }
}
