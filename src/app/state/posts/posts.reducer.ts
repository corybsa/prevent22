import { createReducer, on } from "@ngrx/store";
import { Helper } from "src/app/models/helper";
import { Post } from "src/app/models/post/post";
import { setPost, setPosts } from "./posts.actions";

export interface PostsState {
    all: Post[];
    current: Post;
}

export const initialState: PostsState = {
    all: [],
    current: null
};

export const postsReducer = createReducer(
    initialState,
    on(setPosts, (state, { posts }) => {
        const newState: PostsState = Helper.copy(state);
        newState.all = posts;
        return newState;
    }),
    on(setPost, (state, { post }) => {
        const newState: PostsState = Helper.copy(state);
        newState.current = post;
        return newState;
    })
);
