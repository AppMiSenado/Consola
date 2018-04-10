import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';

@Component({
  selector   : 'new-senators',
  templateUrl: './new.senators.component.html',
  styleUrls  : ['./senators.component.scss']
})

export class NewSenatorsComponent extends Controller implements OnInit {

  private departments:Array<any> = [];
  private commissions:Array<any> = [];
  private parties:Array<any> = [];
  private form:any = {};
  private curules:any;

  private config = {"format": "YYYY-MM-DD"};

  @Input() senator:any;

  @Output() emmiteSenator = new EventEmitter();

  ngOnChanges() {
    if(this.senator !== undefined && this.senator.id){
      this.form = {
          'id'            : this.senator.id,
          'fullname'      : this.senator.fullname,
          'photo'         : this.senator.image,
          'department_id' : this.senator.department_id,
          'gender_id'     : this.senator.gender_id,
          'birthdate'     : this.moment( this.senator.birthdate ).format('YYYY-MM-DD'),
          'party_id'      : this.senator.party_id,
          'profile'       : this.senator.profile,
          'email'         : this.senator.contacts.email,
          'telephones'    : this.senator.contacts.telephones,
          'webpage'       : this.senator.contacts.webPage,
          'facebook'      : this.senator.contacts.socialNetworks.facebook,
          'twitter'       : this.senator.contacts.socialNetworks.twitter,
          'commission_id' : this.senator.commission_id,
          'seat_id'       : this.senator.seat.id,
          'password'      : this.senator.password,
        };
      
    } else {
      this.form = {};
    }
  }

  ngOnInit() {
    this.endpoint.apiGet('departments').subscribe(
        response => this.departments = response,
        error    => this.notify.error(error),
      );

    this.endpoint.apiGet('commissions').subscribe(
        response => this.commissions = response,
        error    => this.notify.error(error),
      );

    this.endpoint.apiGet('parties').subscribe(
        response => this.parties = response,
        error    => this.notify.error(error),
      );
    
      this.getCurules();
    
  }

  loadImage(e){
    if (e.target.files && e.target.files[0]) {
      let file: File         = e.target.files[0];
      let reader: FileReader = new FileReader();
      let senator         = this.form;

      reader.onloadend = function(){
        senator.photo = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  telephones(e){
    this.form.telephones = e;
    // console.log(this.form.telephones);
  }

  isDisabled(){
    if(
         (!this.form.fullname || this.form.fullname === '')
         || (!this.form.party_id || this.form.party_id === '')
         || (!this.form.email || this.form.email === '')
         || (!this.form.photo || this.form.photo === '')
         || (!this.form.department_id || this.form.department_id === '')
         || (!this.form.gender_id || this.form.gender_id === '')
         || (!this.form.birthdate || this.form.birthdate === '')
         || (!this.form.profile || this.form.profile === '')
         || (!this.form.seat_id || this.form.seat_id === '')
      ){
      return true;
    }

    return false;
  }

  save(){
    this.emmiteSenator.emit( this.form );
  }

  getCurules(){
    this.endpoint.apiGet('seats')
      .subscribe(response=>{
        // console.log(response)
        this.curules = response
      }, error    => this.notify.error(error),)
  }

  curulSelected(e){
    // console.log(e)
    this.form.seat_id = e;
    // console.log(this.form)
    
  }

}