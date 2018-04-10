import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
import * as moment from 'moment';


@Component({
  selector: 'probe-new',
  templateUrl: './probe-new.component.html',
  styleUrls: ['./probe.component.scss']
})
export class ProbeNewComponent extends Controller implements OnInit {

  public probe:any={};
  private start :object = {'format':'YYYY-MM-DD'};
  private end:any = {format:'YYYY-MM-DD'};
  @Output() sendData = new EventEmitter();



  ngOnInit() {

  }

  onSumbit(){
    // console.log(this.probe)
    let start = moment(this.probe.start_at).format("YYYY-MM-DD")
    let end = moment(this.probe.end_at).format("YYYY-MM-DD")

    this.probe.start_at = start;
    this.probe.end_at = end;
    this.endpoint.apiPost('surveys', this.probe)
      .subscribe(response=>{
        // console.log(response)
        this.sendData.emit(response);
        this.probe = {}
      }, error=>console.log(error))
  } 

}