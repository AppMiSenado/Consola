import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
declare var jQuery:any;

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent extends Controller implements OnInit {

  private loading:boolean = true;
  private filtered:string = '';
  private administrators: any = [];
  private administrator_id:number;
  private administrator: any = {};

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.endpoint.apiGet('administrators').subscribe(
      response => {
        this.administrators = response;
        this.loading = false;
      },
      error    => this.notify.error(error),
    );
  }

  update(administrator_id){
    let administrator = this.administrators.filter(administrator => administrator.id === administrator_id);
    this.administrator = administrator[0];
    this.fadeIn('administrator');
  }

  store( payload ){
      
    let partyComponent = this;

    if(!payload.id){
      partyComponent.endpoint.apiPost('administrators', payload).subscribe(
        response => {
          partyComponent.ngOnInit();
          partyComponent.notify.success('Se ha creado correctamente el administrador');
        },
        error    => partyComponent.notify.error(error),
      );
    } else {
      partyComponent.endpoint.apiPut('administrators/' + payload.id, payload).subscribe(
        response => {
          partyComponent.ngOnInit();
          partyComponent.notify.success('Se ha modificado correctamente el administrador');
        },
        error    => partyComponent.notify.error(error),
      );
    }
    
    this.fadeOut('administrator');
  }

  delete(){
    this.endpoint.apiDelete('administrators/' + this.administrator_id).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha eliminado correctamente el administrador');
        },
        error    => this.notify.error(error),
      );

    jQuery("#modal-delete").modal("hide");
  }

}
