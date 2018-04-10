import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthService  {

  private routes = [];

  constructor(private router: Router) { }



  isLogged() {
    return (window.sessionStorage.getItem('access_token') === null) ? false : true;
  }

  isAllowed(route: string) {
    let user = JSON.parse(window.sessionStorage.getItem('user'));
    if (user.role_id !== 1) {
      let baseRoute = '/' + route.split('/')[1];
      let routing = this.routes.filter(route => route.roleId === user.role_id)[0];

      return (routing.routes.indexOf(baseRoute) === -1) ? false : true;
    }

    return true;
  }

  isAdmin(){
    let user = JSON.parse(window.sessionStorage.getItem('user'));
    if(user){
      if(user.role_id == 1){
        return true
      }else{
        return false
      }
    }else{
      return false
    }


  }

  isPlenary(){
    let user = JSON.parse(window.sessionStorage.getItem('user'));
    if(user.role_id == 2){
      return true
    }else{
      return false
    }
  }

  isCommision(){

    let user = JSON.parse(window.sessionStorage.getItem('user'));
    if(user.role_id == 3){
      return true
    }else{
      return false
    }
  }
}