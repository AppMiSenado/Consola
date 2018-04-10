import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../../controllers/controller.component';

@Component({
  selector   : 'sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls  : ['./../admin-dashboard.component.scss']
})

export class SessionsListComponent extends Controller implements OnInit {
	
  private filtered:string = '';
	private sessions: any = [];
  private session: any = {};
  
  ngOnInit() {
  	this.getData();
  }

  getData(){
  	this.endpoint.apiGet('analytics/plenaries').subscribe(
      response => this.sessions = response,
      error    => this.notify.error(error),
    );
  }

}