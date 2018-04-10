import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EndPointsService } from 'app/services/endpoints.service';
import { AuthService } from './../../services/auth.service';
import { NotifyService } from './../../services/notify.service';

@Component({
  selector: 'modal-reset-password',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalResetPasswordComponent {

	form:any = {};

	constructor(public _endPointService: EndPointsService,
    public _notifyService: NotifyService,
    public _authService: AuthService
  ) {

  }

  private _sendRequest(){
  	this._endPointService.apiPost('reset', this.form)
	  .subscribe(
		  response => {
		  	this._notifyService.success('Revise su correo. Hemos enviado los pasos para que recupere su contraseña');
		  },
		  error =>{ 
		  	this._notifyService.error(error);
		  });
  }
  
}