import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { ThreadsState } from "./threads.reducer";

export const selectThreads = createSelector(
    (state: AppState) => state.threads,
    (threads: ThreadsState) => threads.all
);

export const selectThread = createSelector(
    
    (state: AppState) => state.threads,
    (threads: ThreadsState) => threads.current
);
