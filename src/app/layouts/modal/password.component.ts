import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EndPointsService } from 'app/services/endpoints.service';
import { AuthService } from './../../services/auth.service';
import { NotifyService } from './../../services/notify.service';

@Component({
  selector: 'modal-password',
  templateUrl: './password.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalPasswordComponent {

	form:any = {};

	constructor(public _endPointService: EndPointsService,
    public _notifyService: NotifyService,
    public _authService: AuthService
  ) {

  }

  private _sendRequest(){
  	this._endPointService.apiPost('change', this.form)
	  .subscribe(
		  response => {
		  	this._notifyService.success('Se ha cambiado la contraseña correctamente');
		  },
		  error =>{ 
		  	this._notifyService.error(error);
		  });
  }
  
}