import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public user:any;
  
  constructor( public router:Router,  private _authService:AuthService ) { }

  ngOnInit() {
    this.user = JSON.parse(window.sessionStorage.getItem('user'))
  }

  logOut(){
    let user = window.sessionStorage.getItem('user');
    let access_token = window.sessionStorage.getItem('access_token');
    if(user && access_token){
      window.sessionStorage.removeItem('user');
      window.sessionStorage.removeItem('access_token');
      this.router.navigate(['/login'])
    }

    

  }

}
