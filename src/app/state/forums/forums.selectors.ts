import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { ForumState } from "./forums.reducer";

export const selectAllForums = createSelector(
    (state: AppState) => state.forums,
    (forums: ForumState) => forums.all
);

export const selectForum = createSelector(
    (state: AppState) => state.forums,
    (forums: ForumState) => forums.current
);
