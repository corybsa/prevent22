import { createReducer, on } from "@ngrx/store";
import { User } from "src/app/models/user/user";
import { setUser } from "./user.actions";

export const initialState: Readonly<User> = null;

export const userReducer = createReducer(
    initialState,
    on(setUser, (state, { user }) => user)
);
