import { createReducer, on } from '@ngrx/store';
import { TCaptain } from '../types/index';

interface CaptainsStore {
  captains: TCaptain[];
}

export const initialState: CaptainsStore = {
  captains: [],
};

export const counterReducer = createReducer(
  initialState
  // on(increment, (state) => state + 1),
  // on(decrement, (state) => state - 1),
  // on(reset, (state) => 0)
);
