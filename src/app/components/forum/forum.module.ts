import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';
import { FormsModule } from '@angular/forms';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { ThreadsComponent } from './threads/threads.component';
import { ForumsComponent } from './forums/forums.component';
import { ThreadsService } from 'src/app/services/forums/threads.service';


@NgModule({
  declarations: [
    ForumComponent,
    ThreadsComponent,
    ForumsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ForumRoutingModule,
    TableModule
  ],
  providers: [
    ForumsService,
    ThreadsService
  ]
})
export class ForumModule { }
