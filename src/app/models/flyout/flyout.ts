import { Component } from "@angular/core";
import { FlyoutContent } from "./flyout-content";
import { FlyoutHistory } from "./flyout-history";
import { FlyoutStatus } from "./flyout-status";

export class Flyout {
    constructor(
        public status: FlyoutStatus,
        public title: string,
        public content: string,
        public showBack: boolean,
        public onClose: Function,
        public history: FlyoutHistory[]
    ) {}
}
