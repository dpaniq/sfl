import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { TCaptain } from '../types';
import { Injectable, OnInit } from '@angular/core';
import { getCaptainsListMock } from '../api/get-captains';
import { Observable } from 'rxjs';
import { CaptainsService } from '../services/captains.service';

export interface CaptainsState {
  captains: TCaptain[];
}

const INITIAL_CAPTAINS_STATE: CaptainsState = {
  captains: [],
};

@Injectable()
export class CaptainsStore
  extends ComponentStore<CaptainsState>
  implements OnStoreInit
{
  readonly captains$ = this.select(({ captains }) => captains);

  constructor(private captainsService: CaptainsService) {
    super(INITIAL_CAPTAINS_STATE);
  }

  async ngrxOnStoreInit(): Promise<void> {
    const captains = await this.captainsService.getCaptains();
    this.setState((state) => ({ ...state, captains }));
  }

  readonly add = this.updater((state, captain: TCaptain) => ({
    captains: [...state.captains, captain],
  }));

  readonly delete = this.updater((state, id: string) => ({
    captains: state.captains.filter((captain) => captain.id !== id),
  }));
}
