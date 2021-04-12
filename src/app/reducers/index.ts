import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Flyout } from '../models/flyout/flyout';
import { User } from '../models/user/user';
import { eventsReducer, EventsState } from '../state/events/events.reducer';
import { flyoutReducer } from '../state/flyout/flyout.reducer';
import { forumReducer, ForumState } from '../state/forums/forums.reducer';
import { postsReducer, PostsState } from '../state/posts/posts.reducer';
import { threadsReducer, ThreadsState } from '../state/threads/threads.reducer';
import { userReducer, UserState } from '../state/user/user.reducer';

export interface AppState {
  user: UserState;
  flyout: Flyout;
  forums: ForumState;
  threads: ThreadsState;
  posts: PostsState;
  events: EventsState;
}

export const reducers: ActionReducerMap<AppState> = {
  user: userReducer,
  flyout: flyoutReducer,
  forums: forumReducer,
  threads: threadsReducer,
  posts: postsReducer,
  events: eventsReducer
};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
