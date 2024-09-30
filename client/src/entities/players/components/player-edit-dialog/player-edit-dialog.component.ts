import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PlayersService } from '@entities/players/services/players.service';
import { PlayerClient } from '@entities/players/types';

@Component({
  selector: 'sfl-player-edit-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
  ],
  providers: [PlayersService],
  templateUrl: './player-edit-dialog.component.html',
  styleUrl: './player-edit-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerEditDialogComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly playersService = inject(PlayersService);

  constructor(
    public dialogRef: MatDialogRef<PlayerEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlayerClient,
  ) {}

  formGroup = new FormGroup<
    FormControls<Pick<PlayerClient, 'nickname' | 'number'>>
  >({
    // name: new FormControl(this.data.name ?? 'name', {
    //   nonNullable: true,
    //   validators: [Validators.required],
    // }),
    // surname: new FormControl(this.data.surname ?? 'surname', {
    //   nonNullable: true,
    //   validators: [Validators.required],
    // }),
    nickname: new FormControl(this.data.nickname ?? 'nickname', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl(this.data.number ?? 4, {
      nonNullable: true,
      validators: [Validators.min(1), Validators.max(9999)],
    }),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.playersService
      .patch(this.data.id, this.formGroup.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(patchedPlayer => {
        console.log('patched player', patchedPlayer);
        this.dialogRef.close(patchedPlayer);
      });
  }
}
