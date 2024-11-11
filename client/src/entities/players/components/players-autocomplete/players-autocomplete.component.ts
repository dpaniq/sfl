import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { EnumGameMode } from '@entities/games/constants';
import { NewGameStore } from '@entities/games/store/new-game.store';
import { DEFAULT_STATISTIC_VALUES } from '@entities/games/store/statistics.feature';
import { IPlayerDTO, TPlayerStatisticFinal } from '@entities/games/types';
import { CreatePlayerDialogComponent } from '../create-player-dialog/create-player-dialog.component';

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
    MatButtonModule,
  ],
  templateUrl: './players-autocomplete.component.html',
  styleUrl: './players-autocomplete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayersAutocompleteComponent {
  readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly newGameStore = inject(NewGameStore);

  public readonly mode = input.required<EnumGameMode>();
  public readonly teamId = input.required<string>();

  protected readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  protected readonly querySearchSignal = signal('');
  protected readonly playersStatisticsGroupByTeamSignal = computed(() => {
    if (this.teamId() === this.newGameStore.teams().at(0)!.id) {
      return {
        alias: this.newGameStore.statisticsBMW() ?? [],
        opponents: this.newGameStore.statisticsHONDA() ?? [],
      };
    } else {
      return {
        alias: this.newGameStore.statisticsHONDA() ?? [],
        opponents: this.newGameStore.statisticsBMW() ?? [],
      };
    }
  });

  protected readonly playersOptionList = computed(() => {
    const searchQuery = this.querySearchSignal().toLowerCase().trim();

    const inclusivePlayers = this.playersStatisticsGroupByTeamSignal().alias;
    const excludingPlayersIds =
      this.playersStatisticsGroupByTeamSignal().opponents.map(
        ({ playerId }) => playerId,
      );

    console.log({
      inclusivePlayers,
      excludingPlayersIds,
      statisticsWithoutTeamId: this.newGameStore.statisticsWithoutTeamId(),
    });

    // TODO Temporary: merge statistics data to show it into autocomplete list
    const players: SetOptional<TPlayerStatisticFinal, 'teamId'>[] =
      this.newGameStore
        .playersEntities()
        // Exclude opponents players
        .filter(player => !excludingPlayersIds.includes(player.id))
        // Merge statistics
        .map(player => {
          const foundStatistic = inclusivePlayers.find(
            statistic => statistic.playerId === player.id,
          );

          if (foundStatistic) {
            return foundStatistic;
          }

          return <TPlayerStatisticFinal>{
            ...DEFAULT_STATISTIC_VALUES,
            id: player.id,
            playerId: player.id,
            playerData: player,
          };
        });

    // const players = inclusivePlayers;

    if (!searchQuery) {
      return players;
    }

    return players.filter(player =>
      // player.name?.toLowerCase().includes(searchQuery) ||
      // player.surname?.toLowerCase().includes(searchQuery) ||
      {
        if (player.id === '658ddee4f71a72e6d8ea98f0') {
          console.log(player);
        }

        return (
          player.playerData?.nickname?.toLowerCase().includes(searchQuery) ||
          player.playerData?.number?.toString().includes(searchQuery)
        );
      },
    );
  });

  // TODO
  protected removeStatisticPlayer(id: string): void {
    this.querySearchSignal.set('');
    this.newGameStore.removeStatisticPlayer(id);
  }

  protected createPlayer() {
    this.dialog
      .open(CreatePlayerDialogComponent, {
        width: '600px',
      })
      .afterClosed()
      .subscribe((player: IPlayerDTO) => {
        console.log('new player', player);
        if (player) {
          this.newGameStore.addPlayer(player);
        }
      });
  }

  protected onSelect(event: MatSelectionListChange) {
    const statistic = event.options.at(0)?.value as TPlayerStatisticFinal;
    const isSelected = event.options.at(0)?.selected;

    const isCaptain =
      this.playersStatisticsGroupByTeamSignal().alias.length === 0;

    this.querySearchSignal.update(() => '');

    // Add new player
    if (isSelected) {
      this.newGameStore.addStatisticPlayer({
        ...statistic,
        isCaptain,
        teamId: this.teamId(),
      });
      return;
    }

    this.newGameStore.removeStatisticPlayer(statistic.id);
  }
}
