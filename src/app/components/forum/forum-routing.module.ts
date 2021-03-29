import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumComponent } from './forum.component';
import { ForumsComponent } from './forums/forums.component';
import { PostsComponent } from './posts/posts.component';
import { ThreadsComponent } from './threads/threads.component';

const routes: Routes = [
  {
    path: '',
    component: ForumComponent,
    children: [
      { path: '', component: ForumsComponent },
      { path: ':forumId/threads', component: ThreadsComponent },
      { path: ':forumId/threads/:threadId', component: PostsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
