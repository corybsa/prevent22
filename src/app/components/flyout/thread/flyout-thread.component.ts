import { Component, Input } from "@angular/core";
import { FlyoutContent } from "src/app/models/flyout/flyout-content";

@Component({
    selector: 'app-flyout-thread',
    templateUrl: './flyout-thread.component.html'
})
export class FlyoutThreadComponent {
    @Input() content: FlyoutContent;
    flyoutContent = FlyoutContent;

    constructor() {}
}
