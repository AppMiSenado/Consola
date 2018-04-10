import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'whippers-new',
  templateUrl: './whippers-new.component.html',
  styleUrls: ['./whippers.component.scss']
})
export class WhippersNewComponent extends Controller implements OnInit {

  private type: string = 'senator';
	private form: any = {};
  private senators: any = [];
  private levels: any = [];
  private departments: any = [];
  private commissions: any = [];

  private currentLevel: any = [];
  private currentSenator: any = [];
  private currentDepartment: any = [];
  private currentCommission: any = [];

  @Input() whipper:any;

  @Output() emmiteWhipper = new EventEmitter();

  private config = {"format": "YYYY-MM-DD"};

  ngOnChanges() {
    
    this.initValues();
    
    if (!this.whipper.senator_id) {
      this.type = 'other';
    }else{
      this.type = 'senator';
    }

    if(this.whipper !== undefined && this.whipper.id){
      let date = new Date(this.whipper.birthdate);
      let month = date.getMonth() + 1;
      this.form = {
          'id'      : this.whipper.id,
          "level_id": this.whipper.level_id,
          "gender_id": this.whipper.gender.id,
          "commission_id": this.whipper.commission_id,
          "department_id": this.whipper.department_id,
          "party_id": this.whipper.party_id,
          "fullname": this.whipper.fullname, 
          "birthdate": this.whipper.birthdate,
          "email": this.whipper.email, 
          "senator_id": this.whipper.senator_id,
          "photo": this.whipper.image
        };

        this.setValues();
       
    } else {
      this.form = {};
    }
  }

  initValues(){
    this.currentLevel = [];
    this.currentSenator = [];
    this.currentDepartment = [];
    this.currentCommission = [];
  }

  setValues(){
    if (this.whipper.senator) {
      this.whipper.senator['text'] = this.whipper.senator['fullname'];
      this.currentSenator = [this.whipper.senator];
    }
    

    this.currentLevel = this.levels.filter(level => level.id == this.form.level_id);
    if (!this.currentLevel) {
      this.currentLevel = [];
    }

    this.currentDepartment = this.departments.filter(department => department.id === this.form.department_id);
     if (!this.currentDepartment) {
      this.currentDepartment = [];
    }

    this.currentCommission = this.commissions.filter(commission => commission.id === this.form.commission_id);
     if (!this.currentCommission) {
      this.currentCommission = [];
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData(){

    this.endpoint.apiGet('senators').subscribe(
      response => {
          this.senators = response.map(result => {
          result.text = result.fullname;
          return result;
        })

        setTimeout(() => {
          this.setValues();
        }, 500)
        
      },
      error    => this.notify.error(error),
    );

    this.endpoint.apiGet('levels').subscribe(
      response => { 
        this.levels = response.map(result => {
          result.text = result.label;
          return result;
        })
      },
      error    => this.notify.error(error),
    );

    this.endpoint.apiGet('departments').subscribe(
      response => this.departments = response.map(result => {
        result.text = result.label;
        return result;
      }),
      error    => this.notify.error(error),
    );

    this.endpoint.apiGet('commissions').subscribe(
      response => this.commissions = response.map(result => {
        result.text = result.name;
        return result;
      }),
      error    => this.notify.error(error),
    );
  
  }

  selectedDepartment(e){
    this.form.department_id = e.id;
  }

  selectedSenator(e){
    this.form.senator_id = e.id;
    this.currentSenator = this.senators.filter(senator => senator.id === this.form.senator_id);
  }

  selectedCommission(e){
    this.form.commission_id = e.id;
  }

  selectedLevel(e){
    this.form.level_id = e.id;
  }

  loadImage(e){
    if (e.target.files && e.target.files[0]) {
      let file: File         = e.target.files[0];
      let reader: FileReader = new FileReader();
      let whipper         = this.form;

      reader.onloadend = function(){
        whipper.photo = reader.result;
        e.target.value = null;
      };

      reader.readAsDataURL(file);
    }
  }

  isDisabled(){
    if (this.type == 'senator') {
      if(
         (!this.form.senator_id || this.form.senator_id === '')
         || (!this.form.level_id || this.form.level_id === '')
      ){
        return true;
      }
    }else{
      if(
         (!this.form.photo || this.form.photo === '')
         || (!this.form.fullname || this.form.fullname === '')
         || (!this.form.email || this.form.email === '')
         || (!this.form.level_id || this.form.level_id === '')
         || (!this.form.department_id || this.form.department_id === '')
         || (!this.form.gender_id || this.form.gender_id === '')
         || (!this.form.birthdate || this.form.birthdate === '')
         || (!this.form.commission_id || this.form.commission_id === '')
      ){
        return true;
      }
    }
    

    return false;
  }

  save(){
    let data;
    
    if(this.whipper !== undefined && this.whipper.id){
      data = this.form;
    }else{
      if (this.type == 'senator') {
        data = {
          "level_id": this.form.level_id,
          "gender_id": this.currentSenator[0].gender_id,
          "commission_id": this.currentSenator[0].commission_id,
          "department_id": this.currentSenator[0].department_id,
          "party_id": this.currentSenator[0].party_id,
          "fullname": this.currentSenator[0].fullname, 
          "birthdate": this.currentSenator[0].birthdate,
          "email": this.currentSenator[0].contacts.email, 
          "senator_id": this.form.senator_id,
          "photo": this.currentSenator[0].image
        }
      }else{
        data = this.form;
      }
    }

    this.emmiteWhipper.emit( data );
  }

}