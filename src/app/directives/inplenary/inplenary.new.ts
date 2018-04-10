import { Plenary } from './../../models/plenary';
import { EndPointsService } from './../../services/endpoints.service';
import { GeneralService } from 'app/services/general.service';
import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Controller } from '../../controllers/controller.component';
import { NotifyService } from 'app/services/notify.service';
import * as moment from 'moment';

@Component({
  selector: 'in-plenary-new',
  templateUrl: './inplenary.new.html',
  styleUrls: ['./inplenary.component.scss']
})
export class InPlenaryNewComponent extends Controller implements OnInit {
  // export class InPlenaryNewComponent implements OnInit {

  private laws: Array<any> = [];
  private lawsEdit: Array<any> = [];
  private config: object = { 'format': 'YYYY-MM-DD hh:mm a' };
  private filter: object = { 'name': '' };
  bills: any[] = [];

  plenary: Plenary;

  constructor(public el: ElementRef,
    public _generalService: GeneralService,
    public _endPointService: EndPointsService,
    public _notify: NotifyService) {
    super(el)
  }

  ngOnInit() {
    this.plenary = new Plenary();
    this.getProjects()
  }


  getProjects() {
    this._endPointService.apiGet('projects')
      .subscribe(response => {
        // console.log(response)
        this.laws = response

        if (this._generalService.activePlenary) {
          this.bills = this._generalService.activePlenary.projects
          this.checkedBills()
        }
        //console.log(this.bills)
      }, error => {
        console.log(error)
        this._notify.error(error);
      })
  }

  addBillLow(b) {
    let from = this.laws.indexOf(b);
    if(b.selected){
      b.selected = false;
      this.moveArraysElementPosition( this.laws, from, this.laws.length)
    }else{
      b.selected = true;
      this.moveArraysElementPosition( this.laws, from, 0)
      
    }


   

    if (!this.objectFindByKeyBoolean(this.bills, "id", b.id)) {
      this.bills.push(b)
    } else {
      this.objectFindByKeyAndRemove(this.bills, "id", b.id);
    }

  }

  moveArraysElementPosition(array, from, to) {
    var extracted = array.splice(from, 1)[0];
    var newArray = array.splice(to, 0, extracted);
  }

  schedulePlenary() {
    let idBills = [];
    for (let b of this.bills) {
      idBills.push(b.id)
    }
    this.plenary.projects = idBills;
    this.plenary.start_at = moment(this.plenary.start_at).format('YYYY-MM-DD HH:mm:ss')
    //console.log( this.plenary.start_at)

    this._endPointService.apiPost('plenaries', this.plenary)
      .subscribe(response => {
        // console.log(response)
        this.getPlenary()
        this.setPlenary();
      }, error => {
        console.log(error)
        this._notify.error(error);
      })
  }


  setPlenary() {
    this._generalService.plenaria = 'programada'
  }

  checkedBills() {
    if (this._generalService.activePlenary) {
      // console.log(this._generalService.activePlenary)
      if (this._generalService.activePlenary.projects) {
        for (let l of this.laws) {
          for (let a of this._generalService.activePlenary.projects) {
            if (l.id == a.id) {
              // console.log("esta")
              l.checked = true;
              if (!this.objectFindByKeyBoolean(this.lawsEdit, "id", l.id)) {
                this.lawsEdit.push(l)
              }
            } else {
              if (!this.objectFindByKeyBoolean(this.lawsEdit, "id", l.id)) {
                l.checked = false;
                this.lawsEdit.push(l)
              }
            }
          }
        }
      }
    }
  }


  editPlenary() {
    let idBills = [];

    for (let b of this.bills) {
      idBills.push(b.id)
    }

    let payload = {
      start_at: moment(this._generalService.activePlenary.start_at).format('YYYY-MM-DD HH:mm:ss'),
      projects: idBills
    }

    this._endPointService.apiPut('plenaries/' + this._generalService.activePlenary.id, payload)
      .subscribe(response => {
        //console.log(response)
        // this._generalService.plenaria = 'en vivo';
      }, error => {
        console.log(error)
        this._notify.error(error);
      })
  }

  getPlenary() {
    this._endPointService.apiGet('plenary')
      .subscribe(response => {
        // console.log(response)
        if (response.length != 0) {
          this._generalService.activePlenary = response;
          let d = moment(this._generalService.activePlenary.start_at)
          this._generalService.activePlenary.start_at = d;

          if (this._generalService.activePlenary) {
            this.bills = this._generalService.activePlenary.projects
            this.checkedBills()
          }

          if (response.closed == null) {
            this._generalService.plenaria = 'no hay'
          }

          if (response.closed == null && response.livestreaming == null) {
            this._generalService.plenaria = 'programada'
          }

          if (response.closed == 0 && response.livestreaming) {
            this._generalService.plenaria = 'en vivo'
          }

        } else {
          this._generalService.plenaria = 'no hay'
        }
        //console.log(this._generalService.activePlenary)

      }, error => {
        this.notify.error(error)
      })
  }

  objectFindByKeyBoolean(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return true;
      }
    }
    return false;
  }


  objectFindByKeyAndRemove(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        array.splice(i, 1);
      }
    }
  }

}
