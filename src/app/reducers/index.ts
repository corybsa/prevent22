import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Flyout } from '../models/flyout/flyout';
import { User } from '../models/user/user';
import { flyoutReducer } from '../state/flyout/flyout.reducer';
import { forumReducer, ForumState } from '../state/forums/forums.reducer';
import { userReducer } from '../state/user/user.reducer';

export interface AppState {
  user: User;
  flyout: Flyout;
  forums: ForumState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  flyout: flyoutReducer,
  forums: forumReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
