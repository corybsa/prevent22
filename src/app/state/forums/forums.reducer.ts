import { createReducer, on } from "@ngrx/store";
import { Forum } from "src/app/models/forum/forum";
import { Helper } from "src/app/models/helper";
import { setAllForums, setForum } from "./forums.actions";

export interface ForumState {
    all: Forum[];
    current: Forum;
}

export const initialState: ForumState = {
    all: [],
    current: null
};

export const forumReducer = createReducer(
    initialState,
    on(setAllForums, (state, { forums }) => {
        const newState: ForumState = Helper.copy(state);
        newState.all = forums;
        return newState;
    }),
    on(setForum, (state, { forum }) => {
        const newState: ForumState = Helper.copy(state);
        newState.current = forum;
        return newState;
    })
);
