import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddForumFlyoutComponent } from './add-forum-flyout/add-forum-flyout.component';
import { FormsModule } from '@angular/forms';
import { FlyoutForumComponent } from './flyout-forum.component';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AddForumFlyoutComponent,
    FlyoutForumComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule
  ],
  exports: [
    FlyoutForumComponent
  ],
  providers: [
    ForumsService
  ]
})
export class FlyoutForumModule { }
