import { Injectable } from '@angular/core';
declare var $:any;

@Injectable()
export class NotifyService {

  config = {
    element  : 'body',
    globalPosition: 'top right',
    style: 'bootstrap',
    autoHide: true,
    animate  : {
       enter : 'animated fadeInDown',
       exit  : 'animated fadeOut'
    },
    showDuration: 400,
    timer    : 800,
    type     : 'default'
  };

  constructor() { }

  success(body: String): void{
    this.config.type = 'success';
    $.notify(body, "success");
  }

  warning(body: String): void{
    this.config.type = 'warning';
    $.notify(body, this.config);
  }

  error(body: String): void{
    this.config.type = 'danger';
    $.notify(body, this.config);
  }

}
