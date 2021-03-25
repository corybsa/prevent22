import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutComponent } from './flyout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlyoutForumModule } from './forum/flyout-forum.module';

@NgModule({
  declarations: [
    FlyoutComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FlyoutForumModule
  ],
  exports: [
    FlyoutComponent
  ]
})
export class FlyoutModule { }
