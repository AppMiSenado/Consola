import { Component, ElementRef } from '@angular/core';
import { EndPointsService } from '../services/endpoints.service';
import { NotifyService } from '../services/notify.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';

@Component({})
export class Controller{

  public el: ElementRef;
  protected moment;
  protected endpoint;
  protected notify;
  protected firebase;
  protected oauth; // Firebase auth

  constructor(

    public element: ElementRef, 
    public _endPointService?: EndPointsService,
    public _notifyService?: NotifyService,
    public _AngularFirebase?: AngularFireDatabase,
    private _FirebaseAuth?: AngularFireAuth) {

    this.el = element;
    
    this.moment = moment;
    this.moment.locale('es');

    this.endpoint = _endPointService;
    this.notify   = _notifyService;
    this.firebase = _AngularFirebase;
    this.oauth    = _FirebaseAuth;
  }

  fadeIn(modalName){
    let _modal = this.el.nativeElement.querySelector(`#modal-${modalName}`);
    if(_modal !== undefined){
      _modal.className     = 'modal-custom modal-fadeIn';
      _modal.style.display = 'block';
    }
  }

  fadeOut(modalName){
    let _modal = this.el.nativeElement.querySelector(`#modal-${modalName}`);
    if(_modal !== undefined){
      _modal.className = 'modal-custom modal-fadeOut';
      setTimeout(() => { _modal.style.display = 'none'; },250);
    }
  }

}
