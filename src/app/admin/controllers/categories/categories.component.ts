import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
declare var jQuery:any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent extends Controller implements OnInit {

	private filtered:string = '';
	private categories: any = [];
	private category_id:number;
  private category: any = {};
  last_page: number;
  page: number = 1;
  loading: boolean = false;

  ngOnInit() {
  	this.getData(this.page);
  }

  getData(page){

    this.loading = true;
    this.endpoint.apiGet(`categories?page=${page}&number=50`)
      .subscribe(response => {
        this.loading = false;
        // console.log(response)
        if (!this.categories) {
          this.categories = response.data;
        } else {
          if (response.data) {
            response.data.forEach(p => {
              this.categories.push(p)
            });

          }
        }

        this.last_page = response.last_page;
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })

  }

  update(category_id){
    let category = this.categories.filter(category => category.id === category_id);
    this.category = category[0];
    this.fadeIn('categoriesNew');
  }

  store( payload ){
      
    let partyComponent = this;

    if(!payload.id){
      partyComponent.endpoint.apiPost('categories', payload).subscribe(
        response => {
          partyComponent.ngOnInit();
          partyComponent.notify.success('Se ha creado correctamente la categoría');
        },
        error    => partyComponent.notify.error(error),
      );
    } else {
      partyComponent.endpoint.apiPut('categories/' + payload.id, payload).subscribe(
        response => {
          partyComponent.ngOnInit();
          partyComponent.notify.success('Se ha modificado correctamente la categoría');
        },
        error    => partyComponent.notify.error(error),
      );
    }
    
    this.fadeOut('categoriesNew');
  }

  delete(){
    this.endpoint.apiDelete('categories/' + this.category_id).subscribe(
        response => {
          this.ngOnInit();
          this.notify.success('Se ha eliminado correctamente el partido');
        },
        error    => this.notify.error(error),
      );

    jQuery("#modal-delete").modal("hide");
  }

  search(){
    // console.log(this.filtered)
    
    if(this.filtered.length !=0){
      this.endpoint.apiGet(`search/categories?keyword=${this.filtered}&page=1&number=50`)
      .subscribe(response=>{
        // console.log(response)
        this.categories = response.data;
      }, error=>{
        this.notify.error(error)
      })
      // this.categories = this.objectFindByKey(this.categories, "name", "description", this.filtered);
    }else{
      this.categories = undefined;
      this.getData(1)
    }
  }

}
