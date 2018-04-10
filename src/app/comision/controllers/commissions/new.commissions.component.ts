import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';

@Component({
  selector   : 'new-commissions',
  templateUrl: './new.commissions.component.html',
  styleUrls  : ['./commissions.component.scss']
})
export class NewCommissionsComponent extends Controller implements OnInit { 

  private senators:Array<any> = [];
  private filterSenators:string = "";
  private form:any = { 'senators' : [] };

  @Input() commission:any;

  @Output() emmiteCommission = new EventEmitter();
  
  ngOnChanges() {
    if(this.commission !== undefined && this.commission.id){
      this.form = {
          'id'          : this.commission.id,
          'name'        : this.commission.name,
          'description' : this.commission.description,
          'playlist_id' : this.commission.playlist_id,
          'logo'        : this.commission.image,
          'senators'    : this.commission.senators,
        };
    } else {
      this.form = { 'senators' : [] };
    }
  }

  ngOnInit() {
    this.endpoint.apiGet('senators').subscribe(
        response => this.senators = response,
        error    => this.notify.error(error),
      );
  }

  loadImage(e){
    if (e.target.files && e.target.files[0]) {
      let file: File         = e.target.files[0];
      let reader: FileReader = new FileReader();
      let commission         = this.form;

      reader.onloadend = function(){
        commission.logo = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  inArray( senator_id ){
    return (this.form.senators.indexOf(senator_id) > -1) ? true  : false;
  }

  add( senator_id ){
    let index = this.form.senators.indexOf(senator_id);
    if(index === -1){
      this.form.senators.push(senator_id);
    } else {
      this.form.senators.splice(index, 1);
    }
  }

  isDisabled(){
    if(
         (!this.form.name || this.form.name === '')
         || (!this.form.description || this.form.description === '')
         || (!this.form.playlist_id || this.form.playlist_id === '')
         || (!this.form.logo || this.form.logo === '')
         || (!this.form.senators || this.form.senators.length === 0)
      ){
      return true;
    }

    return false;
  }

  save(){
    this.emmiteCommission.emit( this.form );
  }


}