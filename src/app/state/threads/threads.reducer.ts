import { createReducer, on } from "@ngrx/store";
import { Helper } from "src/app/models/helper";
import { Thread } from "src/app/models/thread/thread";
import { setThread, setThreads } from "./threads.actions";

export interface ThreadsState {
    all: Thread[];
    current: Thread;
}

export const initialState: ThreadsState = {
    all: [],
    current: null
};

export const threadsReducer = createReducer(
    initialState,
    on(setThreads, (state, { threads }) => {
        const newState: ThreadsState = Helper.copy(state);
        newState.all = threads;
        return newState;
    }),
    on(setThread, (state, { thread }) => {
        const newState: ThreadsState = Helper.copy(state);
        newState.current = thread;
        return newState;
    })
);
