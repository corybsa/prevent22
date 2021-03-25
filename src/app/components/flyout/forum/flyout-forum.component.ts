import { Component, Input } from "@angular/core";
import { FlyoutContent } from "src/app/models/flyout/flyout-content";

@Component({
    selector: 'app-flyout-forum',
    templateUrl: './flyout-forum.component.html'
})
export class FlyoutForumComponent {
    @Input() content: FlyoutContent;
    flyoutContent = FlyoutContent;

    constructor() {}
}
