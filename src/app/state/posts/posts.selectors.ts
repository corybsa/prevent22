import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { PostsState } from "./posts.reducer";

export const selectPosts = createSelector(
    (state: AppState) => state.posts,
    (posts: PostsState) => posts.all
);

export const selectPost = createSelector(
    (state: AppState) => state.posts,
    (posts: PostsState) => posts.current
);
