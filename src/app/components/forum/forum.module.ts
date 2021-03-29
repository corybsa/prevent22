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
import { PostsComponent } from './posts/posts.component';
import { PostsService } from 'src/app/services/forums/posts.service';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { TooltipModule } from 'primeng/tooltip';
import { EditorModule } from 'primeng/editor';


@NgModule({
  declarations: [
    ForumComponent,
    ThreadsComponent,
    ForumsComponent,
    PostsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ForumRoutingModule,
    TableModule,
    PipesModule,
    TooltipModule,
    EditorModule
  ],
  providers: [
    ForumsService,
    ThreadsService,
    PostsService
  ]
})
export class ForumModule { }
