import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutComponent } from './flyout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlyoutForumModule } from './forum/flyout-forum.module';
import { FlyoutThreadModule } from './thread/flyout-thread.module';

@NgModule({
  declarations: [
    FlyoutComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FlyoutForumModule,
    FlyoutThreadModule
  ],
  exports: [
    FlyoutComponent
  ]
})
export class FlyoutModule { }
