import { createAction, props } from "@ngrx/store";
import { Event } from '../../models/event/event';

export const setEvents = createAction(
    '[Events] Set Events',
    props<{ events: Event[] }>()
);

export const setEvent = createAction(
    '[Events] Set Event',
    props<{ event: Event }>()
);
