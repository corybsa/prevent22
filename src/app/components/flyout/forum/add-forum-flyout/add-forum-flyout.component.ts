import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Forum } from 'src/app/models/forum/forum';
import { ForumsService } from 'src/app/services/forums/forums.service';
import { setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setAllForums } from 'src/app/state/forums/forums.actions';

@Component({
  selector: 'app-add-forum-flyout',
  templateUrl: './add-forum-flyout.component.html',
  styleUrls: ['./add-forum-flyout.component.css']
})
export class AddForumFlyoutComponent implements OnInit {
  forum = new Forum();

  constructor(
    private service: ForumsService,
    private toast: MessageService,
    private store: Store
  ) { }

  ngOnInit(): void {
    
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.service.create(this.forum.BoardName, this.forum.BoardDescription).subscribe(
        forums => {
          this.toast.add({ key: 'app-toast', severity: 'success', summary: 'Success', detail: 'Forum Created!' });
          this.store.dispatch(setAllForums({ forums }));
          this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Closed }));
        },
        err => this.toast.add({ key: 'app-toast', severity: 'error', summary: 'Error', detail: err.error.message })
      );
    }
  }
}
