import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TeamEnum } from '@shared/constants/team';
import { PlayersStore } from '@entities/players';
import { CaptainsStore } from '@entities/captains';

@Component({
  selector: 'sfl-team-create',
  standalone: true,
  imports: [
    CommonModule,
    // Material
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './team-create.component.html',
  styleUrl: './team-create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCreateComponent {
  #captainsStore = inject(CaptainsStore);
  #playerStore = inject(PlayersStore);

  teams = [TeamEnum.teamA, TeamEnum.teamB];
  captains$ = this.#captainsStore.captains$;
  players$ = this.#playerStore.players$;
}
