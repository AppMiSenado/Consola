import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'directive-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent  {

  @Input() schedule : Array<any>;
  @Output() objectsShedule = new EventEmitter();

  private initialStartMinute = 0;
  private initialEndMinute   = 86400;

  private daysOfWeek : Array<string> = ['Lu','Ma','Mie', 'Ju', 'Vi', 'Sa', 'Do'];
  private rangeOfDay : any;
  daysSelected:any[]=[]

  private sliderConfig: any;
  private horario:any = 0;

  horarioPrint:string = "00:00:00";

  datePickerConfig = {
    format: "YYYY-MM-DD",
    min : moment(),
  };

  frecuency:string;

  scheduleFormat:any = {};

  ngOnChanges(){

  }

  formatTime(){
    let duration = moment.utc(this.horario*1000).format('HH:mm:ss');
    this.horarioPrint = duration;
    this.scheduleFormat.hour = this.horarioPrint;
    this.objectsShedule.emit(this.scheduleFormat)
  }

  formatFrecuency($event){
    // console.log($event.target.value)
    this.frecuency = $event.target.value;
    this.scheduleFormat.frecuency  = this.frecuency
    if(this.frecuency == "daily" || this.frecuency == "monthly"){
      this.scheduleFormat.days = undefined;
      this.daysSelected = []
    }

    this.objectsShedule.emit(this.scheduleFormat)
  }

  getDays($event){

    if(!this.daysSelected.includes($event.target.value)){
      this.daysSelected.push($event.target.value)
    }else{
      this.daysSelected.splice(this.daysSelected.indexOf($event.target.value), 1)
    }
    this.scheduleFormat.days = this.daysSelected;

    this.objectsShedule.emit(this.scheduleFormat)
  }

  removeFromArray(array, idx) {
    const objIndex = array.findIndex(o => {
      o.id === idx;
    })

    if (objIndex == -1) {
      array.splice(objIndex, 1)
      console.log(array)
      return array;
    }
  }

}




