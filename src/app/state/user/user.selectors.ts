import { createSelector } from "@ngrx/store";
import { User } from "src/app/models/user/user";
import { AppState } from "src/app/reducers";

export const selectCurrentUser = createSelector(
    (state: AppState) => state.user.current,
    (user: User) => user
);

export const selectUser = createSelector(
    (state: AppState) => state.user.user,
    (user: User) => user
);
