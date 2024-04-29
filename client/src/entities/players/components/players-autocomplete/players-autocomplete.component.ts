import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { GamePlayer, NewGameStore } from '@entities/games/store/new-game.store';
import { distinctUntilChanged, map } from 'rxjs';

/**
 * https://stackblitz.com/edit/angular-xgtey4?file=app%2Fchips-autocomplete-example.html
 *
 * https://stackblitz.com/edit/angular-ah51ss?file=app%2Fchips-autocomplete-example.ts
 */

@Component({
  selector: 'sfl-players-autocomplete',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatListModule,
  ],
  templateUrl: './players-autocomplete.component.html',
  styleUrl: './players-autocomplete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersAutocompleteComponent {
  private readonly newGameStore = inject(NewGameStore);

  @Input()
  ngControl!: FormControl<GamePlayer[]>;

  readonly teamId = input.required<string>();
  readonly disabled = this.ngControl.disabled;

  playersSignal = computed(() => {
    return this.newGameStore
      .players()
      .filter(player => {
        const searchQuery = this.playersSearchFCSignal();

        if (!searchQuery) {
          return true;
        }

        return (
          player.name?.toLowerCase().includes(searchQuery) ||
          player.surname?.toLowerCase().includes(searchQuery) ||
          player.nickname.toLowerCase().includes(searchQuery) ||
          player.number?.toString().includes(searchQuery)
        );
      })
      .filter(
        player =>
          !player.teamId ||
          player.teamId === this.teamId() ||
          (player.teamId && player.transferable),
      );
  });

  separatorKeysCodes: number[] = [ENTER, COMMA];

  private readonly destroyRef = inject(DestroyRef);

  readonly playersSearchFC = new FormControl<string>('');

  readonly playersSearchFCSignal = toSignal(
    this.playersSearchFC.valueChanges.pipe(
      distinctUntilChanged(),
      map(value => value?.trim().toLocaleLowerCase() ?? ''),
    ),
    {
      initialValue: '',
    },
  );

  remove(player: GamePlayer): void {
    const raw = this.ngControl.getRawValue();
    this.ngControl.patchValue(raw.filter(({ id }) => id !== player.id));
  }

  isSelected(player: GamePlayer) {
    const raw = this.ngControl.getRawValue();
    return raw.some(({ id }) => id === player.id);
  }

  onSelectOne(event: MatSelectionListChange) {
    const selectedId = event.options.at(0)?.value;

    const allPlayers = this.playersSignal();
    const currentPlayer = allPlayers.find(player => player.id === selectedId)!;
    const selectedPlayers = this.ngControl.getRawValue();

    // Remove player
    if (currentPlayer.teamId) {
      this.ngControl.patchValue(
        selectedPlayers.filter(({ id }) => id !== currentPlayer.id),
      );
      this.playersSearchFC.patchValue('');
      return;
    }

    // Add player
    this.ngControl.patchValue([...selectedPlayers, currentPlayer]);
    this.playersSearchFC.patchValue('');
  }

  // Define compare function
  compareFn(option: any, selected: any) {
    return option && selected ? option.id === selected.id : option === selected;
  }

  onSelect(event: MatSelectionListChange) {
    const ids = event.source.options
      .filter(option => option.selected)
      .map(option => option.value);

    const selectedPlayers: GamePlayer[] = this.newGameStore
      .players()
      .filter(({ id }) => ids.includes(id));

    this.ngControl.patchValue(selectedPlayers);
    this.playersSearchFC.patchValue('');
  }
}
