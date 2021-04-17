import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FlyoutContent } from 'src/app/models/flyout/flyout-content';
import { FlyoutStatus } from 'src/app/models/flyout/flyout-status';
import { Helper } from 'src/app/models/helper';
import { User } from 'src/app/models/user/user';
import { UsersService } from 'src/app/services/users/users.service';
import { setFlyoutContent, setFlyoutStatus } from 'src/app/state/flyout/flyout.actions';
import { setUser } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[];
  isMobile = Helper.isMobile();

  loading = true;
  rows = 10;
  rowsPerPageOptions = [10, 20, 50];
  globalFilterFields = ['Username', 'RoleName', 'FirstName', 'LastName', 'Email'];

  constructor(
    private userService: UsersService,
    private toast: MessageService,
    private store: Store
  ) {
    this.getUsers();
  }

  ngOnInit(): void {
  }

  getUsers() {
    this.userService.getAll().subscribe(
      users => {
        this.users = users;
        this.loading = false;
      },
      err => Helper.showError(this.toast, err.error.message)
    );
  }

  updateUser(user: User) {
    this.store.dispatch(setUser({ user }));
    this.store.dispatch(setFlyoutContent({ title: `Update ${user.Username}'s info`, content: FlyoutContent.User.Update, onClose: this.getUsers.bind(this) }));
    this.store.dispatch(setFlyoutStatus({ status: FlyoutStatus.Open }));
  }

  changePage(e) {
    this.rows = e.rows;
  }
  
  clearFilters(table: Table) {
      table.clear();
  }
}
