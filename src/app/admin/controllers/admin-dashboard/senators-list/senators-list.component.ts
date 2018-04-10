import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../../controllers/controller.component';

@Component({
  selector   : 'senators-list',
  templateUrl: './senators-list.component.html',
  styleUrls  : ['./../admin-dashboard.component.scss']
})

export class SenatorsListComponent extends Controller implements OnInit {

  private senators:Array<any>;
  private senator:any;

  ngOnInit() {
    this.endpoint.apiGet('analytics/senators').subscribe(
        response => {
          this.senators = response;
          this.senator  = response[0];
        },
        error    => this.notify.error(error),
      );
  }

  set(senator_id){
    let senator = this.senators.filter(senator => senator.id === senator_id);
    this.senator = senator[0];
  }
}