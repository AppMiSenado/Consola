import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
declare var jQuery:any;

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']
})
export class CommissionsComponent extends Controller implements OnInit {

  private commissions:Array<any> = [];
  private commission:any;
  private commission_id:number;
  private filtered:string = '';

  ngOnInit() {
    this.endpoint.apiGet('commissions').subscribe(
        response => this.commissions = response,
        error    => this.notify.error(error),
      );
  }

  update(commission_id){
    let commission = this.commissions.filter(commission => commission.id === commission_id);
    this.commission = commission[0];
    this.fadeIn('commission');
  }

  store( payload ){
    if(!payload.id){
      this.endpoint.apiPost('commissions', payload).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha creado correctamente la comisión');
        },
        error    => this.notify.error(error),
      );
    } else {
      this.endpoint.apiPut('commissions/' + payload.id, payload).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha modificado correctamente la comisión');
        },
        error    => this.notify.error(error),
      );
    }

    this.fadeOut('commission');
  }

  delete(){
    this.endpoint.apiDelete('commissions/' + this.commission_id).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha eliminado correctamente la comisión');
        },
        error    => this.notify.error(error),
      );

    jQuery("#modal-delete").modal("hide");
  }

  searchCommision(){
    if(this.filtered.length !=0){
      this.endpoint.apiGet(`search/commissions?keyword=${this.filtered}&page=1&number=15`)
      .subscribe(response=>{
        // console.log(response)
        this.commissions = response.data;
      }, error=>{
        this.notify.error(error)
      })
    }else{
      this.commission = undefined;
      this.endpoint.apiGet('commissions').subscribe(
        response => this.commissions = response,
        error    => this.notify.error(error),
      );
    }
  }

}
