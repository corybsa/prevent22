import { createReducer, on } from "@ngrx/store";
import { Event } from "src/app/models/event/event";
import { Helper } from "src/app/models/helper";
import { setEvent, setEvents } from "./events.actions";

export interface EventsState {
    all: Event[];
    current: Event;
}

export const initialState: EventsState = {
    all: [],
    current: null
};

export const eventsReducer = createReducer(
    initialState,
    on(setEvents, (state, { events }) => {
        const s: EventsState = Helper.copy(state);
        s.all = events;
        return s;
    }),
    on(setEvent, (state, { event }) => {
        const s: EventsState = Helper.copy(state);
        s.current = event;
        return s;
    })
);
