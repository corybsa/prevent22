import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { EventsState } from "./events.reducer";

export const selectEvents = createSelector(
    (state: AppState) => state.events,
    (events: EventsState) => events.all
);

export const selectEvent = createSelector(
    (state: AppState) => state.events,
    (events: EventsState) => events.current
);
