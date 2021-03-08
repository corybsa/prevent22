import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SystemRoles } from 'src/app/models/user/system-roles';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { setUser } from 'src/app/state/user/user.actions';
import { selectUser } from 'src/app/state/user/user.selectors';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  user: User;
  roles = SystemRoles;

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(selectUser)).subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout()
      .pipe(
        tap(() => this.store.dispatch(setUser({ user: null })))
      ).subscribe(() => window.location.replace('/'));
  }
}
