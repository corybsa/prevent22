import { createAction, props } from "@ngrx/store";
import { Thread } from "src/app/models/thread/thread";

export const setThreads = createAction(
    '[Threads] Set Threads',
    props<{ threads: Thread[] }>()
);

export const setThread = createAction(
    '[Threads] Set Thread',
    props<{ thread: Thread }>()
);
