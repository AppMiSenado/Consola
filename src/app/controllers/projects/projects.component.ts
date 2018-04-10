import { Component, OnInit } from '@angular/core';
import { Controller } from '../controller.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends Controller implements OnInit {

  private filter: any = { 'title': '', 'date': '' };
  private address: string;
  public projects: any;
  projectSelected: any = {};
  project_id;
  last_page: number;
  page: number = 1;
  loading: boolean = false;

  ngOnInit() {
    this.getPojects(1)
  }


  getPojects(page) {
    this.loading = true;
    this.endpoint.apiGet(`projects?page=${page}&number=15`)
      .subscribe(response => {
        this.loading = false;
        if (!this.projects) {
          this.projects = response.data;
        } else {
          if (response.data) {
            response.data.forEach(p => {
              this.projects.push(p)
            });

          }
        }

        this.last_page = response.last_page;
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
      })
  }

  editProject(project) {
    this.projectSelected = project;
  }


  deleteProject($event){
    this.endpoint.apiDelete("projects/"+$event.session_id)
      .subscribe(response=>{
        this.projects = []
        this.getPojects(1);
      }, error=>{
        this.notify.error(error)
      })
  }

  //Recibo el proyecto creado
  captureProject($event){
    this.projects = undefined;
    this.getPojects(1)
  }

  //Infinite Scroll
  onScrollDown() {
    if (this.projects) {
      if (this.page <= this.last_page) {
        this.page++
        this.getPojects(this.page)
      } else {
        return
      }
    }
  }

  searchProject(){
    console.log(this.filter.title)
    

    if(this.filter.title !=0){
      this.endpoint.apiGet(`search/projects?keyword=${this.filter.title}&page=1&number=15`)
      .subscribe(response=>{
        // console.log(response)
        this.projects = response.data;
      }, error=>{
        this.notify.error(error)
      })
      // this.projects = this.objectFindByKey(this.projects, "name", "description", this.filter.title);
    }else{
      this.projects = undefined;
      this.getPojects(1)
    }
  }


  //Busqueda
  objectFindByKey(array, key1, key2, value) {
    let res = []
    for (var i = 0; i < array.length; i++) {
      if (array[i][key1].includes(value) || array[i][key2].includes(value)) {
      // if (array[i][key1].indexOf(value) != -1 || array[i][key2].indexOf(value) != -1) {
        res.push(array[i])
      }
    }

    if (res.length != 0) {
      return res
    }else{
      return res
    }

  }


}


