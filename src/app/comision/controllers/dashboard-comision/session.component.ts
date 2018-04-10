import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
import { DomSeguroPipe } from '../../../pipes/dom-seguro.pipe';

@Component({
  selector   : 'commission-session',
  templateUrl: './session.component.html',
  styleUrls  : ['./dashboard-comision.component.scss']
})
export class SessionComponent extends Controller {

  private urlYoutube:string = 'https://www.youtube.com/embed/'
  private streamingCode:string;
  private urlVideo:string;

  @Input() commission:any;
  @Output() emmiterUrl = new EventEmitter();

  ngOnChanges() {
    this.urlVideo      = '';
    this.streamingCode = '';
    
    if(this.commission !== undefined && this.commission.session_id !== false){
      this.urlVideo      = this.commission.livestreaming;
      this.streamingCode = this.commission.livestreaming.replace( this.urlYoutube, '' ).replace('?rel=0&amp;showinfo=0', '');
    }
  }

  setUrl(){
    if(this.streamingCode){
      this.urlVideo = this.urlYoutube + this.streamingCode + "?rel=0&amp;showinfo=0"
    }else{
      this.urlVideo = undefined;
    }
  }

	init(){
		this.emmiterUrl.emit({'commission_id': this.commission.id, 'livestreaming': this.urlVideo, 'session_id': this.commission.session_id});
	}

}
