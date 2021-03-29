import { Component, Input } from "@angular/core";
import { FlyoutContent } from "src/app/models/flyout/flyout-content";

@Component({
    selector: 'app-flyout-post',
    templateUrl: './flyout-post.component.html'
})
export class FlyoutPostComponent {
    @Input() content: FlyoutContent;
    flyoutContent = FlyoutContent;

    constructor() {}
}
