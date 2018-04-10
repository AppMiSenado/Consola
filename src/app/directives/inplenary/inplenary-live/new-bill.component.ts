import { CurulesService } from './../../../services/curules.service';
import { DataFake } from './../../../controllers/notifications/notifications/dataFake';
import { NotifyService } from 'app/services/notify.service';
import { GeneralService } from './../../../services/general.service';
import { Bill } from './../../../models/bill';
import { Controller } from './../../../controllers/controller.component';
import { Component, OnInit, ElementRef } from '@angular/core';
import { EndPointsService } from 'app/services/endpoints.service';


declare var $: any;

@Component({
  selector: 'app-new-bill',
  templateUrl: './new-bill.component.html',
  styleUrls: ['./new-bill.component.scss']
})
export class NewBillComponent extends Controller implements OnInit {
  // export class NewBillComponent implements OnInit {
  bill: Bill = new Bill();
  categories: any = [];
  idsCategories:any[] = [];

  constructor(public el: ElementRef,
    public _endPointService: EndPointsService,
    public _generalService: GeneralService,
    public _notifyService: NotifyService,
    public _curulesService:CurulesService,
    public df: DataFake) {
    super(el);
  }

  ngOnInit() {
    // $(".error").notify("Hello Box");
    this.getCategories()
  }

  getCategoriesSelected($event) {
    this.bill.categories = $event;
  }


  onSubmit() {
    let a:any;
    for(a of this.bill.categories){
      this.idsCategories.push(a.id)
    }

    let payload = {
      plenary_id: this._generalService.activePlenary.id,
      name: this.bill.name,
      link: this.bill.link,
      description: this.bill.description,
      categories: this.idsCategories
    }

    this._endPointService.apiPost("projects", payload)
      .subscribe(response => {
        // console.log(response)
        this.bill = new Bill();
        this.idsCategories = [];

        let res = response;
        res.voted_at = null
        this._curulesService.bills.push(res);

        console.log(this._curulesService.bills)
      }, error => {
        this._notifyService.error(error)
        console.log(error)
      })
  }


  resetForm() {
    // console.log(this.bill)
    this.bill = new Bill();
  }


  getCategories() {
    this._endPointService.apiGet("categories")
      .subscribe(response => {
        // console.log(response)
        this.categories = response
      })
  }

}
