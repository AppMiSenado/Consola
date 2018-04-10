import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Injectable()
export class GuardPlenaryService {

  constructor(private router: Router,
    public authService:AuthService) { }

  canActivate(){

    if (this.authService.isLogged() === true) {
      // válido para plenaria

      if(this.authService.isPlenary() === true ){
        // console.log('plenaria')
        return true;
      }
      
      if(this.authService.isCommision() === true){
        this.router.navigate(['/dashboard-comision']);
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
