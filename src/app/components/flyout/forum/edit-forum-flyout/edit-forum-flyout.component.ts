import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Forum } from 'src/app/models/forum/forum';
import { Helper } from 'src/app/models/helper';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setAllForums, setForum } from 'src/app/state/forums/forums.actions';
import { selectForum } from 'src/app/state/forums/forums.selectors';

@Component({
  selector: 'app-edit-forum-flyout',
  templateUrl: './edit-forum-flyout.component.html',
  styleUrls: ['./edit-forum-flyout.component.css']
})
export class EditForumFlyoutComponent implements OnInit {
  forum: Forum;

  constructor(
    private service: ForumsService,
    private toast: MessageService,
    private store: Store
  ) {
    this.store.select(selectForum).subscribe(forum => this.forum = Helper.copy(forum));
  }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.service.update(this.forum.BoardId, this.forum.BoardName, this.forum.BoardDescription).subscribe(
        forums => {
          this.toast.add({ key: 'app-toast', severity: 'success', summary: 'Success', detail: 'Forum updated!' });
          this.store.dispatch(setForum({ forum: null }));
          this.store.dispatch(setAllForums({ forums }));
          this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
        },
        err => this.toast.add({ key: 'app-toast', severity: 'error', summary: 'Error', detail: err.error.message })
      );
    }
  }
}
