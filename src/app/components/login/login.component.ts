import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  windowHeight = window.innerHeight;
  userModel = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  submit(loginForm: NgForm) {
    if(loginForm.valid) {
      this.authService.login(this.userModel.username, this.userModel.password)
        .pipe(
          tap(user => console.log(user))
        ).subscribe();
    }
  }
}
