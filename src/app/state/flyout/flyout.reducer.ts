import { createReducer, on } from "@ngrx/store";
import { Flyout } from "src/app/models/flyout/flyout";
import { FlyoutHistory } from "src/app/models/flyout/flyout-history";
import { FlyoutStatus } from "src/app/models/flyout/flyout-status";
import { Helper } from "src/app/models/helper";
import { navFlyoutBack, setFlyout, setFlyoutContent, setFlyoutStatus } from "./flyout.actions";

export const initialState: Flyout = {
    status: FlyoutStatus.Closed,
    title: null,
    content: null,
    history: [],
    showBack: false,
    onClose: null
};

export const flyoutReducer = createReducer(
    initialState,
    on(setFlyout, (state, { flyout }) => flyout),
    on(setFlyoutStatus, (state, { status }) => {
        const newState: Flyout = Helper.copy(state);
        newState.status = status;

        if(status === FlyoutStatus.Closed) {
            if(state.onClose) {
                state.onClose();
            }

            newState.title = null;
            newState.content = null;
            newState.history = [];
            newState.showBack = false;
            newState.onClose = null;
        }

        return newState;
    }),
    on(setFlyoutContent, (state, { title, content, onClose }) => {
        const newState: Flyout = Helper.copy(state);
        newState.title = title;
        newState.content = content;
        newState.onClose = onClose;

        if(!newState.history) {
            newState.history = [];
        }

        if(state.content !== content && state.content !== null) {
            newState.history.push({ title: state.title, content: state.content, onClose: state.onClose });
        }

        if(newState.history.length > 0) {
            newState.showBack = true;
        }

        return newState;
    }),
    on(navFlyoutBack, (state) => {
        const newState: Flyout = Helper.copy(state);
        const historyItem: FlyoutHistory = state.history.pop();
        newState.title = historyItem.title;
        newState.content = historyItem.content;
        newState.onClose = historyItem.onClose;
        newState.showBack = newState.history.length > 0;

        return newState;
    })
);
