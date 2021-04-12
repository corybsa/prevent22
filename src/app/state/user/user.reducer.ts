import { createReducer, on } from "@ngrx/store";
import { Helper } from "src/app/models/helper";
import { User } from "src/app/models/user/user";
import { setCurrentUser, setUser } from "./user.actions";

export interface UserState {
    current: User;
    user: User;
}

export const initialState: UserState = {
    current: null,
    user: null
};

export const userReducer = createReducer(
    initialState,
    on(setCurrentUser, (state, { user }) => {
        const newState: UserState = Helper.copy(state);
        newState.current = user;
        return newState;
    }),
    on(setUser, (state, { user }) => {
        const newState: UserState = Helper.copy(state);
        newState.user = user;
        return newState;
    })
);
