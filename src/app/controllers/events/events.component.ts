import { Component, OnInit } from '@angular/core';
import { Controller } from '../controller.component';
import * as datefns from 'date-fns';
declare var jQuery:any;

const colors: any = {
  white: {
    primary: '#fff',
    secondary: '#eee'
  }
};

@Component({
  selector   : 'app-events',
  templateUrl: './events.component.html',
  styleUrls  : ['./events.component.scss']
})
export class EventsComponent extends Controller implements OnInit {

  private calendar:any      = {};
  private filter:any        = {'title':'', 'date': '' };
  private month:string      = '';
  private event:any         = {};
  private event_id:number;

  ngOnInit() {
    
    if(this.filter.date === ''){
      this.filter.date = this.moment().format('YYYY-MM-DD');
      this.today();
    } 

    this.calendar.events = [];
    this.endpoint.apiGet('events').subscribe(

        response => {
          response.forEach(event => {
            console.log(event);
            
            this.calendar.events.push({
              id       : event.id || null,
              start    : datefns.startOfDay(event.published_at),
              end      : datefns.endOfDay(event.published_at),
              title    : event.title,
              date     : this.moment(event.published_at).format("YYYY-MM-DD"),
              hour     : this.moment(event.published_at).format("h:mm a"),
              fulldate : this.moment(event.published_at).format("dddd, D [de] MMMM [de] YYYY"),
              color    : colors.white,
              link     : event.link || null,
            });
          });
        },
        error    => this.notify.error(error),
      );
  }

  update(event_id){
    let event  = this.calendar.events.filter(event => event.id === event_id);
    this.event = event[0];
    this.fadeIn('event');
  }

  store( payload ){

    payload.published_at = this.moment(payload.published_at).format('YYYY-MM-DD HH:mm:ss');
    
    if(!payload.id){
      this.endpoint.apiPost('events', payload).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha creado correctamente el evento');
        },
        error    => this.notify.error(error),
      );
    } else {
      this.endpoint.apiPut('events/' + payload.id, payload).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha modificado correctamente el evento');
        },
        error    => this.notify.error(error),
      );
    }
    
    this.fadeOut('event');
    
  }

  delete(){
    this.endpoint.apiDelete('events/' + this.event_id).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha eliminado correctamente el evento');
        },
        error    => this.notify.error(error),
      );

    jQuery("#modal-delete").modal("hide");
  }

  hasEvents(date){
    let events = this.calendar.events.filter(event => event.date === datefns.format(date, 'YYYY-MM-DD'));
    if( this.isDateSelected(date) ){
      return false;
    }
    return (events.length > 0) ? true : false;
  }

  isDateSelected(date){
    return this.filter.date === datefns.format(date, 'YYYY-MM-DD');
  }

  dayClicked(e){
    this.filter.date = datefns.format(e.day.date, 'YYYY-MM-DD');
  }

  prevMonth(){
    let month = this.calendar.date.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
    this.calendar.date = this.moment(month);
    this.month         = this.calendar.date.format('MMMM YYYY');
    this.filter.date   = datefns.format(this.calendar.date.format('YYYY-MM-DD'), 'YYYY-MM-DD');

    this.calendar.events = [];
    this.endpoint.apiGet('events', {'date':this.calendar.date.format('YYYY-MM-DD')}).subscribe(
        response => {
          response.forEach(event => {
            this.calendar.events.push({
              id       : event.id,
              start    : datefns.startOfDay(event.published_at),
              end      : datefns.endOfDay(event.published_at),
              title    : event.title,
              date     : this.moment(event.published_at).format("YYYY-MM-DD"),
              hour     : this.moment(event.published_at).format("h:mm a"),
              fulldate : this.moment(event.published_at).format("dddd, D [de] MMMM [de] YYYY"),
              color    : colors.white,
            });
          });
        },
        error    => this.notify.error(error),
      );
  }

  nextMonth(){
    let month = this.calendar.date.add(1, 'month').startOf('month').format('YYYY-MM-DD');
    this.calendar.date = this.moment(month);
    this.month         = this.calendar.date.format('MMMM YYYY');
    this.filter.date   = datefns.format(this.calendar.date.format('YYYY-MM-DD'), 'YYYY-MM-DD');

    this.calendar.events = [];
    this.endpoint.apiGet('events', {'date':this.calendar.date.format('YYYY-MM-DD')}).subscribe(
        response => {
          response.forEach(event => {
            this.calendar.events.push({
              id       : event.id,
              start    : datefns.startOfDay(event.published_at),
              end      : datefns.endOfDay(event.published_at),
              title    : event.title,
              date     : this.moment(event.published_at).format("YYYY-MM-DD"),
              hour     : this.moment(event.published_at).format("h:mm a"),
              fulldate : this.moment(event.published_at).format("dddd, D [de] MMMM [de] YYYY"),
              color    : colors.white,
            });
          });
        },
        error    => this.notify.error(error),
      );
  }

  today(){
    this.calendar.date = this.moment().startOf('day');
    this.month         = this.calendar.date.format('MMMM YYYY');
  }

}
