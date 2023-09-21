import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { TCaptain } from '../types';
import { Injectable, OnInit } from '@angular/core';
import { getCaptainsListMock } from '../api/get-captains';
import { initialState } from './reducer';
import { Observable } from 'rxjs';

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
  readonly captains$ = this.select((state) =>
    state.captains.filter((captain) => captain.captain)
  );

  constructor() {
    super(INITIAL_CAPTAINS_STATE);
  }

  async ngrxOnStoreInit(): Promise<void> {
    const captains = await getCaptainsListMock();
    this.setState((state) => ({ ...state, captains }));
  }

  readonly add = this.updater((state, captain: TCaptain) => ({
    captains: [...state.captains, captain],
  }));

  readonly delete = this.updater((state, id: string) => ({
    captains: state.captains.filter((captain) => captain.id !== id),
  }));
}
