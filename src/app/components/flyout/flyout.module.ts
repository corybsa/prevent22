import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutComponent } from './flyout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlyoutForumModule } from './forum/flyout-forum.module';
import { FlyoutThreadModule } from './thread/flyout-thread.module';
import { FlyoutPostModule } from './post/flyout-post.module';
import { FlyoutUserModule } from './user/flyout-user.module';
import { FlyoutEventModule } from './event/flyout-event.module';

@NgModule({
  declarations: [
    FlyoutComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FlyoutForumModule,
    FlyoutThreadModule,
    FlyoutPostModule,
    FlyoutUserModule,
    FlyoutEventModule
  ],
  exports: [
    FlyoutComponent
  ]
})
export class FlyoutModule { }
