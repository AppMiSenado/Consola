import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';

@Component({
  selector   : 'administrator-new',
  templateUrl: './new.administrator.component.html',
  styleUrls  : ['./administrators.component.scss']
})

export class AdministratorsNewComponent extends Controller implements OnInit {
  private form:any = {};
  private roles:Array<any> = [];

  @Input() administrator:any;

  @Output() emmiteAdministrator = new EventEmitter();

  ngOnChanges() {
    if(this.administrator !== undefined && this.administrator.id){
      this.form = {
          'id'       : this.administrator.id,
          'fullname' : this.administrator.fullname,
          'email'    : this.administrator.email,
          'role_id'  : this.administrator.role_id,
        };
    } else {
      this.form = {};
    }
  }

  ngOnInit() {
    this.endpoint.apiGet('roles').subscribe(
        response => this.roles = response,
        error    => this.notify.error(error),
      );
  }

  isDisabled(){
    if(
       (!this.form.fullname || this.form.fullname === '') ||
       (!this.form.email || this.form.email === '') ||
       (!this.form.role_id || this.form.role_id === '')
    ){
      return true;
    }

    return false;
  }

  save(){
    this.emmiteAdministrator.emit( this.form );
  }

}