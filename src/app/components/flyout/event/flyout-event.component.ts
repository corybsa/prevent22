import { Component, Input } from "@angular/core";
import { FlyoutContent } from "src/app/models/flyout/flyout-content";

@Component({
    selector: 'app-flyout-event',
    templateUrl: './flyout-event.component.html'
})
export class FlyoutEventComponent {
    @Input() content: FlyoutContent;
    flyoutContent = FlyoutContent;

    constructor() {}
}
