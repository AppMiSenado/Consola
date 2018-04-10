import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';

@Component({
  selector   : 'parties-new',
  templateUrl: './parties-new.component.html',
  styleUrls  : ['./parties.component.scss']
})

export class PartiesNewComponent extends Controller implements OnInit {

  private form:any = {};

  @Input() party:any;

  @Output() emmiteParty = new EventEmitter();

  ngOnChanges() {

    if(this.party !== undefined && this.party.id){
      this.form = {
          'id'      : this.party.id,
          'image'   : this.party.image,
          'name'    : this.party.name,
          'color'   : this.party.color,
          'status'   : this.party.status,
        };
    } else {
      this.form = {
        'color'   : '#000000',
        'status'   : 1,
      };
    }
  }

  ngOnInit() {
    
  }

  loadImage(e){
    if (e.target.files && e.target.files[0]) {
      let file: File         = e.target.files[0];
      let reader: FileReader = new FileReader();
      let party         = this.form;

      reader.onloadend = function(){
        party.image = reader.result;
        e.target.value = null;
      };

      reader.readAsDataURL(file);
    }
  }

  isDisabled(){
    if(
       (!this.form.name || this.form.name === '')
       || (!this.form.color || this.form.color === ''
       || (!this.form.image || this.form.image === ''))
    ){
      return true;
    }

    return false;
  }

  save(){
    this.emmiteParty.emit( this.form );
  }
}