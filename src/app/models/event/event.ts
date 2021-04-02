export class Event {
    id: string;
    allDay?: boolean;
    start: Date;
    end: Date;
    title: string;
    description?: string;
    location?: string;

    // TODO:
    // defined but recurrence functionality is not implemented yet
    daysOfWeek?: number[]; // ex [2, 4] means an event repeats every Tuesday and Thursday. If omitted the event is assumed to repeat every day
    startTime?: string; // in HH:mm:ss format
    endTime?: string; // in HH:mm:ss format
    startRecur?: Date; // when the recurrence starts. if omitted recurrences will extend infinitely into the past
    endRecur?: Date; // when the recurrence ends. if omitted recurrences will extend infinitely into the future
                    // note: make this value to date *after* you want the last recurrence
    groupId?: string; // might generate this on create.
}
