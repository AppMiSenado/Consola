import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Injectable()
export class GuardCommisionService implements CanActivate{

  constructor(private router: Router,
              public authService:AuthService) { }


  canActivate(){

    if (this.authService.isLogged() === true) {
     
      // válido para comision
      if(this.authService.isCommision() === true ){
        return true;
      }
      
      if(this.authService.isPlenary() === true){
        this.router.navigate(['/events']);
        return false;
      }

      if(this.authService.isAdmin() === true){
        this.router.navigate(['/admin-dashboard']);
        return false;
      }

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
