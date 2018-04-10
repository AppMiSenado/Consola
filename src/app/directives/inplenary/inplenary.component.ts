import { EndPointsService } from 'app/services/endpoints.service';
import { GeneralService } from './../../services/general.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Controller } from '../../controllers/controller.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'in-plenary',
  templateUrl: './inplenary.component.html',
  styleUrls: ['./inplenary.component.scss']
})
export class InplenaryComponent extends Controller implements OnInit {
// export class InplenaryComponent implements OnInit {

  constructor(public el: ElementRef,
              public _generalService:GeneralService,
              public _endPointService:EndPointsService, 
              public router:Router){
    super(el)
  }

  ngOnInit() {
    this.getPlenary()
  }

  urlRecived($event){
    this._generalService.urlStreaming = $event;
  }


  getPlenary(){
    this._endPointService.apiGet('plenary')
    .subscribe(response=>{
      // console.log(response)
      if(response.length != 0){
        this._generalService.activePlenary = response;
        let d = moment(this._generalService.activePlenary.start_at)
        this._generalService.activePlenary.start_at = d;
        
        if(response.closed == null){
          this._generalService.plenaria = 'no hay'
        }
  
        if(response.closed == null && response.livestreaming == null){
          this._generalService.plenaria = 'programada'
        }
  
        if(response.closed == 0 && response.livestreaming){
          this._generalService.plenaria = 'en vivo'
        }
        
      }else{
        this._generalService.plenaria = 'no hay'
      }
      //console.log(this._generalService.activePlenary)
     
    }, error=>{
      this.notify.error(error)
    })
  }
} 
