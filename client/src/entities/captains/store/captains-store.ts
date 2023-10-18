import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { TCaptain, TCaptainSelected } from '../types';
import { Injectable, OnInit, inject } from '@angular/core';
import { getCaptainsListMock } from '../api/get-captains';
import { Observable } from 'rxjs';
import { CaptainsService } from '../services/captains.service';
import { TeamEnum } from '@shared/constants/team';

export interface CaptainsState {
  captains: TCaptain[];
  selected: TCaptainSelected[];
}

const INITIAL_CAPTAINS_STATE: CaptainsState = {
  captains: [],
  selected: [],
};

@Injectable()
export class CaptainsStore
  extends ComponentStore<CaptainsState>
  implements OnStoreInit
{
  private captainsService = inject(CaptainsService);

  readonly captains$ = this.select(({ captains }) => captains);
  readonly selectedCaptains$ = this.select(({ selected }) => selected);
  readonly captainsWithoutTeam$ = this.select(({ captains, selected }) => {
    const selectedIds = selected.map((select) => select.id);
    return captains.filter((captain) => !selectedIds.includes(captain.id));
  });

  constructor() {
    super(INITIAL_CAPTAINS_STATE);
  }

  async ngrxOnStoreInit(): Promise<void> {
    const captains = await this.captainsService.getCaptains();
    this.setState((state) => ({ ...state, captains }));
  }

  readonly add = this.updater((state, captain: TCaptain) => ({
    ...state,
    captains: [...state.captains, captain],
  }));

  readonly delete = this.updater((state, id: string) => ({
    ...state,
    captains: state.captains.filter((captain) => captain.id !== id),
  }));

  readonly addSelected = this.updater(
    (state, { id, team }: { id: string; team: TeamEnum }) => {
      const findCaptain = state.captains.find((captain) => captain.id === id);
      if (!findCaptain) {
        return state;
      }
      const selected = state.selected.filter(
        (selected) => selected.team !== team
      );
      return {
        ...state,
        selected: [...selected, { ...findCaptain, team }],
      };
    }
  );

  readonly deleteSelected = this.updater((state, id: string) => ({
    ...state,
    selected: state.selected.filter((captain) => captain.id !== id),
  }));
}
