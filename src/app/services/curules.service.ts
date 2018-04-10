import { NotifyService } from './notify.service';
import { EndPointsService } from 'app/services/endpoints.service';
import { GeneralService } from 'app/services/general.service';
import { Injectable } from '@angular/core';
import { StorageService } from 'app/services/storage.service';


@Injectable()
export class CurulesService {
  public arrayCurules: any[] = [];
  public arrayCurulesAsistencia: any[] = [];
  bills: any[];
  billPlay: any = [];
  id: any;
  idLocalStorage: boolean = false;
  totalAsistencia: any = [];

  constructor(public _storageService: StorageService,
              public _endPointService:EndPointsService,
              public _notifyService:NotifyService, 
              public _generalService:GeneralService) { }

  playBill(bill, index) {
  
    let guardado = this._storageService.get('bill' + bill.id)

    this.billPlay = bill;
    this.billPlay.senators = this.arrayCurules
    this.billPlay.reference = 'si';
    for (var i = 0; i < this.billPlay.senators.length; i++) {
      this.billPlay.senators[i].vote = undefined;
    }

    // console.log(this.billPlay)

    if (guardado != null) {
      this.billPlay = guardado;
    }

    this.bills.splice(index, 1)

    this._storageService.get('bill' + bill.id) ? this.idLocalStorage = true : this.idLocalStorage = false;

  }

  endDiscussion() {
   // console.log(this.bills)
    this.bills.unshift(this.billPlay);
    this.id = 'bill' + this.billPlay.id;

    if (this._storageService.get(this.id)) {
      this._storageService.destroy(this.id)
      this._storageService.set(this.id, this.billPlay)
    } else {
      this._storageService.set(this.id, this.billPlay)
    }

    setTimeout(()=>{
      this.billPlay = [];
    }, 600)
  }

  cancelar() {
    this.bills.unshift(this.billPlay);
    setTimeout(()=>{
      this.billPlay = [];
    }, 600)
  }

  votar() {
    // console.log(this.billPlay)
    this.billPlay.voted_at = "si",
    this.bills.push(this.billPlay);

    console.log(this.billPlay)
    this._endPointService.apiPost('plenaries/senators/' + this._generalService.activePlenary.id, this.billPlay)
    .subscribe(response => {
      //console.log(response)
      // this.billPlay.voted_at = "si",

    }, error => {
      console.log(error)
      this._notifyService.error(error)
    })


    this.billPlay = [];

  }

  reset(id) {
    this._storageService.destroy("bill" + id)
    this.billPlay.senators = this.arrayCurulesAsistencia;
    this.idLocalStorage = false;
  }

}
