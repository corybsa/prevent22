import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { EditorModule } from "primeng/editor";
import { ThreadsService } from "src/app/services/forums/threads.service";
import { AddThreadFlyoutComponent } from './add-thread-flyout/add-thread-flyout.component';
import { EditThreadFlyoutComponent } from './edit-thread-flyout/edit-thread-flyout.component';
import { FlyoutThreadComponent } from "./flyout-thread.component";
import { PostsService } from "src/app/services/forums/posts.service";

@NgModule({
    declarations: [
        FlyoutThreadComponent,
        AddThreadFlyoutComponent,
        EditThreadFlyoutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        EditorModule
    ],
    exports: [
        FlyoutThreadComponent
    ],
    providers: [
        ThreadsService,
        PostsService
    ]
})
export class FlyoutThreadModule { }
