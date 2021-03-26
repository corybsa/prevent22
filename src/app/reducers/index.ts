import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Flyout } from '../models/flyout/flyout';
import { User } from '../models/user/user';
import { flyoutReducer } from '../state/flyout/flyout.reducer';
import { forumReducer, ForumState } from '../state/forums/forums.reducer';
import { threadsReducer, ThreadsState } from '../state/threads/threads.reducer';
import { userReducer } from '../state/user/user.reducer';

export interface AppState {
  user: User;
  flyout: Flyout;
  forums: ForumState;
  threads: ThreadsState
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  flyout: flyoutReducer,
  forums: forumReducer,
  threads: threadsReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
