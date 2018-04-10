import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';

@Component({
  selector   : 'categories-new',
  templateUrl: './categories-new.component.html',
  styleUrls  : ['./categories.component.scss']
})

export class CategoriesNewComponent extends Controller implements OnInit {
	private form:any = {};

  @Input() category:any;

  @Output() emmiteCategory = new EventEmitter();

  ngOnChanges() {
    if(this.category !== undefined && this.category.id){
      this.form = {
          'id'      : this.category.id,
          'name'   : this.category.name
        };
    } else {
      this.form = {};
    }
  }

  ngOnInit() {
    
  }

  isDisabled(){
    if(
       (!this.form.name || this.form.name === '')
    ){
      return true;
    }

    return false;
  }

  save(){
    this.emmiteCategory.emit( this.form );
  }

}