import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { User } from '../models/user/user';
import { userReducer } from '../state/user/user.reducer';

export interface AppState {
  user: User;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
