import { Component, Input } from "@angular/core";
import { FlyoutContent } from "src/app/models/flyout/flyout-content";

@Component({
    selector: 'app-flyout-user',
    templateUrl: './flyout-user.component.html'
})
export class FlyoutUserComponent {
    @Input() content: FlyoutContent;
    flyoutContent = FlyoutContent;

    constructor() {}
}
