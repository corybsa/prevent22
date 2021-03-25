import { createSelector } from "@ngrx/store";
import { Flyout } from "src/app/models/flyout/flyout";
import { AppState } from "src/app/reducers";

export const selectFlyout = createSelector(
    (state: AppState) => state.flyout,
    (flyout: Flyout) => flyout
);
