import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';
import { Helper } from 'src/app/models/helper';
import { AuthService } from 'src/app/services/auth/auth.service';
import { setCurrentUser } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  windowHeight = window.innerHeight;
  userModel = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  showUsernameError = false;
  showPasswordError = false;
  showConfirmPasswordError = false;

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router,
    private toast: MessageService
  ) { }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    const username = form.controls['username'];
    const password = form.controls['password'];
    const confirmPassword = form.controls['confirmPassword'];

    this.showUsernameError = !username.valid;
    this.showPasswordError = !password.valid;
    this.showConfirmPasswordError = !confirmPassword.valid;

    if(!form.valid) {
      return;
    }

    this.authService.register(
      this.userModel.username,
      this.userModel.password,
      this.userModel.confirmPassword
    )
    .pipe(
      tap(user => this.store.dispatch(setCurrentUser({ user })))
    )
    .subscribe(
      () => {
        this.router.navigate(['/']);
      },
      err => Helper.showError(this.toast, err.error.message)
    );
  }
}
