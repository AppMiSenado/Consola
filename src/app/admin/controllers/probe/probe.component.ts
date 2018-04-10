import { Component, OnInit } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';


@Component({
  selector: 'app-probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.scss']
})
export class ProbeComponent extends Controller implements OnInit {
  last_page: number;
  page: number = 1;
  loading: boolean = false;
  probe: any;
  IdDelete: any;
  search: string;

  ngOnInit() {
    this.getProbe(1)
  }

  getProbe(page) {
    this.loading = true;
    this.endpoint.apiGet(`surveys?page=${page}&number=20`)
      .subscribe(response => {
        this.loading = false;
        if (!this.probe) {
          this.probe = response.data;
        } else {
          if (response.data) {
            response.data.forEach(p => {
              this.probe.push(p)
            });

          }
        }

        this.last_page = response.last_page;
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })

  }


  recivedData() {
    this.probe = undefined;
    this.page = 1;
    this.getProbe(1)
  }

  onScrollDown() {
    console.log("scroll", this.probe)
    if (this.probe) {
      if (this.page < this.last_page) {
        this.page++
        this.getProbe(this.page)
      } else {
        return
      }
    }
  }

  setId(id) {
    this.IdDelete = id;
  }

  deleteProbe($event) {
    this.loading = true;
    this.endpoint.apiDelete("surveys/" + $event.session_id)
      .subscribe(response => {
        this.loading = false;
        console.log(response)
        this.probe = undefined;
        this.page = 1;
        this.getProbe(1)
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })

  }

  searchProbe(){
    if(this.search.length !=0){
      this.endpoint.apiGet(`search/surveys?keyword=${this.search}&page=1&number=15`)
      .subscribe(response=>{
        console.log(response)
        this.probe = response.data;
      }, error=>{
        this.notify.error(error)
      })
    }else{
      this.probe = undefined;
      this.getProbe(1)
    }
  }

}
