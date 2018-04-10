import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Controller } from '../controller.component';



@Component({
  selector   : 'app-event',
  templateUrl: './event.component.html',
  styleUrls  : ['./events.component.scss']
})
export class EventComponent extends Controller implements OnInit {

  private commissions:Array<any> = [];
  private form:any = {};

  private config :object = {'format':'YYYY-MM-DD hh:mm a'};

  @Input() event:any;
  @Output() emmiteEvent = new EventEmitter();

  ngOnChanges() {

    if(this.event !== undefined && this.event.id){
      this.form = {
          'id'            : this.event.id,
          'commission_id' : this.event.commission_id,
          'title'         : this.event.title,
          'published_at'  : this.moment( this.event.published_at ).format('YYYY-MM-DD hh:mm a'),
          'link'          : this.event.link
        };
    } else {
      this.form = {};
    }
  }

  ngOnInit() {
    this.endpoint.apiGet('commissions').subscribe(
        response => this.commissions = response,
        error    => this.notify.error(error),
      );
  }

  isDisabled(){
    if(
         (!this.form.title || this.form.title === '')
         || (!this.form.published_at || this.form.published_at === '')
         || (!this.form.link || this.form.link === '')
      ){
      return true;
    }

    return false;
  }

  save(){
    this.emmiteEvent.emit( this.form );
    this.form = {};
  }

}
