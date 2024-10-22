import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IPlayerDTO } from '@entities/games/types';
import { PlayersService } from '@entities/players/services/players.service';
import { catchError, delay, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'sfl-create-player-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
  ],
  templateUrl: './create-player-dialog.component.html',
  styleUrl: './create-player-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlayersService],
})
export class CreatePlayerDialogComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly playersService = inject(PlayersService);
  private readonly dialogRef: MatDialogRef<CreatePlayerDialogComponent> =
    inject(MatDialogRef);

  protected readonly loadingSignal = signal(false);

  formGroup = new FormGroup<
    FormControls<Pick<IPlayerDTO, 'nickname' | 'number'>> & {
      user: FormGroup<
        FormControls<SetRequired<Partial<IPlayerDTO['user']>, 'id' | 'email'>>
      >;
    }
  >({
    nickname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.min(1),
        Validators.max(999),
        Validators.pattern(/^[0-9]*$/),
      ],
    }),
    // TODO: problem with type
    user: new FormGroup<any>({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      name: new FormControl('', {
        nonNullable: true,
      }),
      surname: new FormControl('', {
        nonNullable: true,
      }),
    }),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // TODO - exclude type casting
    const player = this.formGroup.getRawValue() as IPlayerDTO;

    of(player)
      .pipe(
        tap(() => {
          this.loadingSignal.update(() => true);
        }),
        delay(3_000),
        switchMap(() => {
          return this.playersService
            .create(player)
            .pipe(map(players => players.at(0)!));
        }),
        catchError(error => {
          console.error(error);
          return of();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((player: IPlayerDTO) => {
        this.dialogRef.close(player);
      });
  }
}
