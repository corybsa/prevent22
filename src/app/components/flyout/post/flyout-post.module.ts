import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EditorModule } from "primeng/editor";
import { ToastModule } from "primeng/toast";
import { PostsService } from "src/app/services/forums/posts.service";
import { EditPostFlyoutComponent } from "./edit-post-flyout/edit-post-flyout.component";
import { FlyoutPostComponent } from "./flyout-post.component";

@NgModule({
    declarations: [
        FlyoutPostComponent,
        EditPostFlyoutComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ToastModule,
        EditorModule
    ],
    exports: [
        FlyoutPostComponent
    ],
    providers: [
        PostsService
    ]
})
export class FlyoutPostModule { }
