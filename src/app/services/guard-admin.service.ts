import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Injectable()
export class GuardAdminService implements CanActivate {

  constructor(private router: Router,
    public authService: AuthService) { }

  canActivate() {

    if (this.authService.isLogged() === true) {

      // válido para comision
      if (this.authService.isAdmin() === true) {
        // console.log('admin')
        return true;
      }

      if (this.authService.isPlenary() === true) {
        this.router.navigate(['/events']);
        return false;
      }

      if (this.authService.isCommision() === true) {
        this.router.navigate(['/dashboard-comision']);
        return false;
      }

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
