import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Helper } from 'src/app/models/helper';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  windowHeight = window.innerHeight;
  model = {
    newPassword: '',
    newPasswordVerify: ''
  };

  resetCode = '';

  showNewPasswordError = false;
  showNewPasswordVerifyError = false;

  constructor(
    private service: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: MessageService
  ) {
    this.resetCode = this.route.snapshot.paramMap.get('code');
  }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    const newPassword = form.controls['newPassword'];
    const newPasswordVerify = form.controls['newPasswordVerify'];

    this.showNewPasswordError = !newPassword.valid;
    this.showNewPasswordVerifyError = !newPasswordVerify.valid;

    if(!form.valid) {
      return;
    }

    this.service.resetPassword(this.model.newPassword, this.resetCode).subscribe(
      () => {
        Helper.showSuccess(this.toast, 'Password Reset! You can login using your new password now.');
        this.router.navigate(['/auth/login']);
      },
      err => Helper.showError(this.toast, err.error.message)
    );
  }
}
