import { NotifyService } from './../../services/notify.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EndPointsService } from 'app/services/endpoints.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: userToLogin = new userToLogin()


  constructor(public _endPointService: EndPointsService,
    public _notifyService: NotifyService,
    public router: Router,
    public _authService: AuthService
  ) {

  }

  ngOnInit() {
    this.checkLogin()
  }


  logme() {
    this._endPointService.apiPost('auth', this.user)
      .subscribe(
      response => {
        window.sessionStorage.setItem('user', JSON.stringify(response.user));
        window.sessionStorage.setItem('access_token', response.access_token);
  
        let user = JSON.parse(window.sessionStorage.getItem('user'));

        setTimeout(() => {
          if (user.role_id == 1) {
            // console.log('admin')
            this.router.navigate(['/admin-dashboard']);
          }

          if (user.role_id == 2) {
            // console.log('plenaria')
            this.router.navigate(['/events']);
          }

          if (user.role_id == 3) {
            // console.log('comision')
            this.router.navigate(['/dashboard-comision']);
          }
        }, 300)

      },
      error => {
        this._notifyService.error(error);
      });
  }


  checkLogin() {
    let user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this._authService.isLogged() === true) {
      if (user.role_id == 1) {
        // console.log('admin')
        this.router.navigate(['/admin-dashboard']);
      }

      if (user.role_id == 2) {
        // console.log('plenaria')
        this.router.navigate(['/events']);
      }

      if (user.role_id == 3) {
        // console.log('comision')
        this.router.navigate(['/dashboard-comision']);
      }

    } else {
      this.router.navigate(['/login']);
    }
  }
}


export class userToLogin {
  email: string;
  password: string;
}
