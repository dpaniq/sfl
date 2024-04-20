import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PlayerStatsCardComponent } from '@entities/players';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'sfl-players-selection',
  // templateUrl: './players-selection.component.html',
  template: '',
  styleUrls: ['./players-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    PlayerStatsCardComponent,
  ],
  providers: [],
})
export class PlayersSelectionComponent {
  // readonly playersStore = inject(PlayersStore);
  // constructor(
  //   private _destroyRef: DestroyRef,
  //   private _liveAnnouncer: LiveAnnouncer,
  //   private captainsStore: CaptainsStore,
  // ) {}
  // readonly teamEnum = TeamEnum;
  // readonly currentTeam$ = signal<TeamEnum>(TeamEnum.teamA);
  // readonly lastAction = signal(null);
  // readonly playerTeamA$ = this.playersStore.playersTeamsA$;
  // readonly playerTeamB$ = this.playersStore.playersTeamsB$;
  // @Input({ required: true }) control!: FormControl<boolean>;
  // @ViewChild(MatSort) sort!: MatSort;
  // ngOnDestroy() {}
  // ngOnInit() {
  //   combineLatest([
  //     this.captainsStore.selectedCaptains$.pipe(
  //       map(captains => captains.length),
  //       map(() => 2),
  //     ),
  //     this.playersStore.selected$.pipe(map(players => players.length)),
  //   ])
  //     .pipe(takeUntilDestroyed(this._destroyRef))
  //     .subscribe(([captainsCount, playersCounts]) => {
  //       this.control.patchValue(captainsCount >= 2 && playersCounts >= 2);
  //     });
  //   combineLatest([
  //     this.playerTeamA$.pipe(map(players => players.map(({ id }) => id))),
  //     this.playerTeamB$.pipe(map(players => players.map(({ id }) => id))),
  //     this.playersStore.players$,
  //   ])
  //     .pipe(
  //       // distinctUntilChanged(
  //       //   ([a, b]) => JSON.stringify(a) !== JSON.stringify(b)
  //       // ),
  //       map(([playersIdsA, playersIdsB, players]) => {
  //         return players.filter(
  //           player => ![...playersIdsA, ...playersIdsB].includes(player.id),
  //         );
  //       }),
  //       takeUntilDestroyed(this._destroyRef),
  //     )
  //     .subscribe(players => {
  //       console.log(players);
  //       this.dataSource.data = players;
  //       this.dataSource.sort = this.sort;
  //     });
  //   this.dataSource.sortingDataAccessor = (item, property) => {
  //     console.log(item, property);
  //     switch (property) {
  //       case 'date': {
  //         return new Date(item.nickname);
  //       }
  //       default: {
  //         return item[property as keyof TPlayer] as any;
  //       }
  //     }
  //   };
  // }
  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  // }
  // readonly dataSource = new MatTableDataSource<TPlayer | TChosenPlayer>([]);
  // readonly displayedColumns: (keyof TPlayer | '<' | '>')[] = [
  //   '<',
  //   'avatar',
  //   'name',
  //   'surname',
  //   'nickname',
  //   '>',
  // ];
  // /** Announce the change in sort state for assistive technology. */
  // announceSortChange(sortState: Sort | any) {
  //   console.log(sortState, typeof sortState);
  //   // This example uses English messages. If your application supports
  //   // multiple language, you would internationalize these strings.
  //   // Furthermore, you can customize the message to add additional
  //   // details about the values being sorted.
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }
  // addIntoTeam(player: TPlayer, team: TeamEnum) {
  //   console.log(player, team);
  //   // this.playersStore.addSelected({ id: player.id, team });
  //   this.currentTeam$.update(team => {
  //     return team === TeamEnum.teamA ? TeamEnum.teamB : TeamEnum.teamA;
  //   });
  // }
  // deleteSelected(id: string) {
  //   this.playersStore.deleteSelected(id);
  //   this.currentTeam$.update(team => {
  //     return team === TeamEnum.teamA ? TeamEnum.teamB : TeamEnum.teamA;
  //   });
  // }
}
