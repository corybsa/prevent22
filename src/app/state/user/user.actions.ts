import { createAction, props } from "@ngrx/store";
import { User } from "src/app/models/user/user";

export const setCurrentUser = createAction(
    '[User] Set Current User',
    props<{ user: User }>()
);

export const setUser = createAction(
    '[User] Set User',
    props<{ user: User}>()
);
