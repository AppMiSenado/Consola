import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Controller } from 'app/controllers/controller.component';

@Component({
  selector: 'app-new-bill-admin',
  templateUrl: './new-bill-admin.component.html',
  styleUrls: ['./new-bill-admin.component.scss']
})
export class NewBillAdminComponent extends Controller implements OnInit {

  // constructor( el:ElementRef) { 
  //   super(el)

  // }

  @Input() bills:any[];
  @Input() idSessionPelanary:number;
  @Output() updateProjects = new EventEmitter();

  projects:any[]

  billsSelected:any[]=[]

  ngOnInit() {
    this.getBills()
  }

  ngOnChanges(){
    // console.log(this.bills)
    if(this.idSessionPelanary){
      // console.log(this.idSessionPelanary)
    }
  }


  getBills() {
    this.endpoint.apiGet("projects")
      .subscribe(response => {
        this.projects = response;
        // console.log("BILLS",this.projects)
      }, error => {
        this.notify.error(error)
        // console.log(error)
      })
  }

  getProyectsSelected($event){
    this.billsSelected = $event;
    // console.log($event)
  }


  updatePlenary(){
    let idBills:any[] = [];
    for(let b of this.billsSelected) {
      idBills.push(b.id)
    }

    let payload = {
      projects: idBills
    }


    console.log(payload, this.idSessionPelanary)

   
      this._endPointService.apiPost('plenaries/projects/'+ this.idSessionPelanary, payload)
      .subscribe(response=>{
        // console.log(response)
        this.updateProjects.emit("Actualizado")

        // this.bills = undefined
        // this.projects =undefined
        // this.billsSelected = [];
        // this._generalService.activePlenary = response;`
        // this._curulesService.bills = response.projects;
      },error=>{
        this.notify.error(error)
      })
    }


    cancelar(){
      // this.bills = undefined
      // this.projects =undefined
      this.billsSelected = [];
    }
}
