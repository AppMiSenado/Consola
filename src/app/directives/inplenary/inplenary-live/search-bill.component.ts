import { GeneralService } from 'app/services/general.service';
import { DataFake } from 'app/controllers/notifications/notifications/dataFake';
import { Controller } from 'app/controllers/controller.component';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Bill } from 'app/models/bill';
import { CurulesService } from 'app/services/curules.service';
import { EndPointsService } from 'app/services/endpoints.service'
import * as moment from 'moment';

@Component({
  selector: 'app-search-bill',
  templateUrl: './search-bill.component.html',
  styleUrls: ['./search-bill.component.scss']
})
export class SearchBillComponent extends Controller implements OnInit {
  // export class SearchBillComponent implements OnInit {

  // bills: Bill[];
  billsSelected:any[]=[]
  search = true;

  constructor(public el: ElementRef,
    public df: DataFake,
    public _curulesService: CurulesService,
    public _generalService: GeneralService,
    public _endPointService: EndPointsService) {
    super(el);
  }

  ngOnInit() {
    // console.log("Inicio")
    this._generalService.getBills()
    //console.log(this._generalService.activePlenary)
  }


  getProyectsSelected($event) {
    this.billsSelected = $event;
    //console.log(this.billsSelected)
  }

  updatePlenary(){
    let idBills:any[] = [];
    for(let b of this.billsSelected) {
      idBills.push(b.id)
    }

    let payload = {
      projects: idBills
    }

    if(this._generalService.activePlenary){
      this._endPointService.apiPost('plenaries/projects/'+this._generalService.activePlenary.id, payload)
      .subscribe(response=>{
        // console.log(response)
        this._generalService.activePlenary = response;
        this._curulesService.bills = response.projects;
      })
    }

    
  }


  

}
