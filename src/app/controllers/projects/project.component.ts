import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Controller } from '../controller.component';



@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectComponent extends Controller implements OnInit, OnChanges  {
  
  idsCategories:any[] = [];

  @Input() id: number;
  @Input() project: any;
  @Output() newProject:any = new EventEmitter();


  edit:boolean = false;

  borrarChips:boolean = false;

  ngOnInit() {
    this.getCategories()

  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.project.id){
      this.edit = true;
    }else{
      this.edit = false;
    }
  }

  categories: any = [];

  getCategories() {
    this.endpoint.apiGet("categories")
      .subscribe(response => {
        this.categories = response
      })
  }

  getCategoriesSelected($event) {
    this.project.categories = $event;
  }


  cancelar(){
    this.edit = false;
    this.getCategories()
    this.project.categories = []
    this.newProject.emit('cancel');
    this.borrarChips = true;
  }

  saveBill(){
    let a:any;
    for(a of this.project.categories){
      this.idsCategories.push(a.id)
    }

    let payload = {
      name: this.project.name,
      link: this.project.link,
      description: this.project.description,
      categories: this.idsCategories
    }

    this.endpoint.apiPost("projects", payload)
      .subscribe(response => {
        this.newProject.emit(response);
        this.idsCategories = [];
        this.borrarChips = true;

      }, error => {
        this._notifyService.error(error)
        console.log(error)
      })
  }

  editBill(){
    let a:any;
    let id=[]
    console.log(this.project.categories)
    for(a of this.project.categories){
      id.push(a.id)
    }
    let payload = {
      name: this.project.name,
      link: this.project.link,
      description: this.project.description,
      categories: id
    }

    console.log(payload)

    this.endpoint.apiPut("projects/"+this.project.id, payload)
      .subscribe(response => {
        this.idsCategories = [];
        this.newProject.emit(response);
        this.borrarChips = true;
      }, error => {
        this._notifyService.error(error)
        console.log(error)
      })
  }

}

