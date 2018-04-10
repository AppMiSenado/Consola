import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
declare var jQuery:any;

@Component({
  selector: 'app-whippers',
  templateUrl: './whippers.component.html',
  styleUrls: ['./whippers.component.scss']
})
export class WhippersComponent extends Controller implements OnInit {

	private filtered:string = '';
	private whippers: any = [];
	private whipper_id:number;
  private whipper: any = {};
  last_page: number;
  page: number = 1;
  loading: boolean = false;

  ngOnInit() {
  	this.getData(this.page);
  }

  getData(page){
  	// this.endpoint.apiGet('whippers').subscribe(
    //   response => {
    //     this.whippers = response
    //   },
    //   error    => this.notify.error(error),
    // );
    this.loading = true;
    this.endpoint.apiGet(`whippers?page=${page}&number=70`)
      .subscribe(response => {
        this.loading = false;
        console.log(response)
        if (!this.whippers) {
          this.whippers = response.data;
        } else {
          if (response.data) {
            response.data.forEach(p => {
              this.whippers.push(p)
            });

          }
        }

        this.last_page = response.last_page;
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })
  }

  update(whipper_id){
    let whipper = this.whippers.filter(whipper => whipper.id === whipper_id);
    this.whipper = whipper[0];
    let short = this.whipper.birthdate.split(" ")
    this.whipper.birthdate = short[0];
    // console.log(this.whipper)
    this.fadeIn('whippersNew');
  }

  store( payload ){
    
    let whipperComponent = this;
    if(!payload.id){
      whipperComponent.endpoint.apiPost('whippers', payload).subscribe(
        response => {
          whipperComponent.ngOnInit();
          whipperComponent.notify.success('Se ha creado correctamente el whipper');
        },
        error    => whipperComponent.notify.error(error),
      );
    } else {
      whipperComponent.endpoint.apiPut('whippers/' + payload.id, payload).subscribe(
        response => {
          whipperComponent.ngOnInit();
          whipperComponent.notify.success('Se ha modificado correctamente el whipper');
        },
        error    => whipperComponent.notify.error(error),
      );
    }
    
    this.fadeOut('whippersNew');
  }

  delete(){
    this.endpoint.apiDelete('whippers/' + this.whipper_id).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha eliminado correctamente el whipper');
        },
        error    => this.notify.error(error),
      );

    jQuery("#modal-delete").modal("hide");
  }

  search(){
    // console.log(this.filtered)
    
    if(this.filtered.length !=0){
      this.endpoint.apiGet(`search/whippers?keyword=${this.filtered}&page=1&number=50`)
      .subscribe(response=>{
        console.log(response)
        this.whippers = response.data;
      }, error=>{
        this.notify.error(error)
      })
     
    }else{
      this.whippers = undefined;
      this.getData(1)
    }
  }

}
