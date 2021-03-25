import { FlyoutContent } from "./flyout-content";

export class FlyoutHistory {
    constructor(
        public title: string,
        public content: string,
        public onClose: Function
    ) {}
}
