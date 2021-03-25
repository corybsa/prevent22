import { Component } from "@angular/core";
import { createAction, props } from "@ngrx/store";
import { Flyout } from "src/app/models/flyout/flyout";

export const setFlyout = createAction(
    '[Flyout] Set Flyout',
    props<{ flyout: Flyout }>()
);

export const setFlyoutStatus = createAction(
    '[Flyout] Set Status',
    props<{ status: string }>()
);

export const setFlyoutContent = createAction(
    '[Flyout] Set Content',
    props<{ title: string, content: string, onClose?: Function }>()
);

export const navFlyoutBack = createAction(
    '[Flyout] Navigate back'
);
