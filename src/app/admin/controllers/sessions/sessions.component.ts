import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent extends Controller implements OnInit {

  public plenaries:any;
  last_page: number;
  page: number = 1;
  loading: boolean = false;

  sessionSelected:any;

  search:string = "";

  dataRecibida:any;

  private config: object = { 'format': 'YYYY-MM-DD' };

  ngOnInit() {
    this.getSesions(1);
  }



  getSesions(page){
    this.loading = true;
    this.endpoint.apiGet(`plenaries?page=${page}&number=30`)
      .subscribe(response=>{
        this.loading = false;
        //  console.log(response)
        if (!this.plenaries) {
          this.plenaries = response.data;
        } else {
          if (response.data) {
            response.data.forEach(p => {
              this.plenaries.push(p)
            });

          }
        }

        this.last_page = response.last_page;
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })
  }

    //Infinite Scroll
    onScrollDown() {
      if (this.plenaries) {
        if (this.page <= this.last_page) {
          this.page++
          this.getSesions(this.page)
        } else {
          return
        }
      }
    }


    selectSeccion(s){
      this.sessionSelected = s;
    }

    searchSesions(){

      // let result = this.objectFindByKey(this.plenaries, "start_at", this.search)
      console.log(this.search)
      if(this.search){
        this.endpoint.apiGet(`search/plenaries?keyword=${this.search}&page=1&number=15`)
        .subscribe(response=>{
          // console.log(response)
          this.plenaries = response.data;
        }, error=>{
          this.notify.error(error)
        })
        
      }else{
        this.plenaries = undefined;
        this.getSesions(1)
      }
      // if(this.search.length !== 0){
      //   this.plenaries = result;
      // }else{
      //   // this.plenaries = []
      //   this.page = 1;
      //   this.getSesions(1)
      // }
    }


    recivedData($event){
      this.sessionSelected = undefined;
      this.page = 1;
      this.dataRecibida = $event;
      this.getSesions(1)
    }



    objectFindByKey(array, key, value) {
      let r = [];

      for (var i = 0; i < array.length; i++) {
        if (array[i][key].includes(value)) {
          r.push(array[i])
        }
      }
      return r;
    }
}
