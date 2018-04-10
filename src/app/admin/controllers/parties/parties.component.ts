import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
declare var jQuery:any;

@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.scss']
})
export class PartiesComponent extends Controller implements OnInit {

	private filtered:string = '';
	private parties: any = [];
	private party_id:number;
	private party: any = {};

  ngOnInit() {
  	this.getData();
  }

  getData(){
  	this.endpoint.apiGet('parties').subscribe(
      response => this.parties = response,
      error    => this.notify.error(error),
    );
  }

  update(party_id){
    let party = this.parties.filter(party => party.id === party_id);
    this.party = party[0];
    this.fadeIn('partiesNew');
  }

  store( payload ){
      
    let partyComponent = this;

    if(!payload.id){
      partyComponent.endpoint.apiPost('parties', payload).subscribe(
        response => {
          partyComponent.ngOnInit();
          partyComponent.notify.success('Se ha creado correctamente el partido');
        },
        error    => partyComponent.notify.error(error),
      );
    } else {
      partyComponent.endpoint.apiPut('parties/' + payload.id, payload).subscribe(
        response => {
          partyComponent.ngOnInit();
          partyComponent.notify.success('Se ha modificado correctamente el partido');
        },
        error    => partyComponent.notify.error(error),
      );
    }
    
    this.fadeOut('partiesNew');
  }

  delete(){
    this.endpoint.apiDelete('parties/' + this.party_id).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha eliminado correctamente el partido');
        },
        error    => this.notify.error(error),
      );

    jQuery("#modal-delete").modal("hide");
  }
}
