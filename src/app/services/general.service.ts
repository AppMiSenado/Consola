import { NotifyService } from 'app/services/notify.service';
import { EndPointsService } from 'app/services/endpoints.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class GeneralService implements CanActivate {

  inLive: boolean = false;
  plenaria: string = 'no hay';
  urlStreaming: string;
  activePlenary: any;
  bills: any[] = [];
  edit: boolean = false;
  
  constructor(public router: Router,
    public _endPointService: EndPointsService,
    public _notifyService: NotifyService) {

    this.getBills()
  }

  canActivate() {
    // Plenaria
    if (this.plenaria == 'en vivo') {
      return true;
    } else {
      this.router.navigate(['/events']);
      return false;
    }
  }

  getBills() {
    this._endPointService.apiGet("projects")
      .subscribe(response => {
        this.bills = response;
        // console.log("BILLS",this.bills)
      }, error => {
        this._notifyService.error(error)
        //console.log(error)
      })
  }
}
