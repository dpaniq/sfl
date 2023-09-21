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
  ],
  providers: [CaptainsService, provideComponentStore(CaptainsStore)],
})
export class NewMatchWidgetComponent implements OnInit {
  readonly captains$ = this.captainsStore.captains$;

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
    private readonly captainsStore: CaptainsStore
  ) {}

  readonly variantEnum = Variant;
  public readonly players$ = this.captainsService.players$;
  // public readonly captains$ = this.captainsService.captains$;

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

  displayFn(captain: TCaptain): string {
    return captain ? `#${captain.number} - ${captain.nickname}` : '';
  }

  ngOnInit() {
    this.captainsStore.captains$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((captains) =>
        console.log('WE GET CAPTAINS FROM STORE', captains)
      );

    console.log(this.captainsStore.captains$);

    console.log('t2', this.captainsToAdd$(), this.options_.value);
    this.myControl.valueChanges
      .pipe(startWith(''), takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (typeof value === 'string') {
          const captains = this.captainsService
            .captainsToAdd$()
            .filter((captain) =>
              captain.nickname.toLowerCase().includes(value)
            );
          console.log(captains);
          this.options_.next(captains);
          return;
        }
        console.log('TCAPTAIN', value);
        // this.options_.next()
        this.captainsService.addCaptain((value as TCaptain).id);

        // Captain's store logic
        this.captainsStore.add({
          ...(value as TCaptain),
          captain: true,
        });
      });
  }
}
