import { Component, OnInit, ElementRef, EventEmitter, Output } from '@angular/core';
import { Controller } from 'app/controllers/controller.component';
import * as moment from 'moment';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss']
})
// export class ComposerComponent implements OnInit {
export class ComposerComponent extends Controller implements OnInit {
  programar: string = "now";
  schedule = [{
    en: "daily",
    es: "diario"
  },
  {
    en: "weekly",
    es: "semanal"
  },
  {
    en: "monthly",
    es: "mensual"
  }
  ]


  public notification: Notification;


  // constructor(public el: ElementRef) {
  //   super(el)

  //  }

  ngOnInit() {
    this.notification = new Notification();
    this.notification.schedule = undefined;
    this.notification.frecuency = null;
  }


  scheduleRecived($event) {
    this.notification.schedule = $event;
    this.notification.frecuency = $event.frecuency;
  }

  checkSend() {
    if (this.programar == 'now') {
      this.notification.schedule = [];
      this.notification.frecuency = null;
    }
  }


  saveNotification() {

    if (this.programar !== "now") {
      let start = moment(this.notification.schedule.start_at).format("YYYY-MM-DD HH:mm:ss")
      this.notification.schedule.start_at = start

      let end = moment(this.notification.schedule.end_at).format("YYYY-MM-DD HH:mm:ss")
      this.notification.schedule.end_at = end
    }


    this.endpoint.apiPost("notifications", this.notification)
      .subscribe(response => {
        // console.log(response)
        this.notification = new Notification()
      }, error => this.notify.error(error))
  }
}



export class Notification {
  title: string;
  message: string;
  link: string;
  frecuency: string;
  schedule: any;
}