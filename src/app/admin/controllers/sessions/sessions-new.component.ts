import { NotifyService } from './../../../services/notify.service';
import { EndPointsService } from 'app/services/endpoints.service';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";


@Component({
  selector: 'sessions-new',
  templateUrl: './sessions-new.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsNewComponent extends Controller implements OnInit {

  @Input() session: any;
  @Output() sendUpdate = new EventEmitter;
  
  senators: any;
  sessionData: any;
  loading: boolean = false;
  curulesVotation: any;
  opcion: any = "si"
  private chart: AmChart;
  dataSi: any[];
  dataNo: any[];
  projects: any[];
  billsSelected: any;
  mapa: boolean = true;
  text: string = "Votado";

  constructor(public el: ElementRef,
    private AmCharts: AmChartsService,
    public endpoint: EndPointsService,
    public notify: NotifyService) {
    super(el)

  }


  ngOnInit() {

  }

  ngOnChanges() {
    if (this.session) {
      this.getSession()
    }

  }

  getSession(){
    this.loading = true;
    this.endpoint.apiGet(`plenaries/${this.session.id}`)
      .subscribe(response => {
        this.loading = false;
        this.sessionData = response;
       
        // console.log(response)

        let pro = []
        for (let p of response.data) {
          pro.push(p.project)
        }

        this.projects = pro;
      }, error => {
        this.loading = false;
        this.notify.error(error)
      })
  }

  selectProyect($event) {
    this.curulesVotation = this.sessionData.data[$event.target.value];
    console.log(this.curulesVotation.project.pivot.status)

    if(this.curulesVotation.project.pivot.status == "1"){
      this.mapa = false;
      this.text = "Por votar"
    }

    if(this.curulesVotation.project.pivot.status == "2"){
      this.mapa = false;
      this.text = "Por votar"
    }

    if(this.curulesVotation.project.pivot.status == "3"){
      this.mapa = true;
      this.text = "Votado"
    }

    this.dataSi = [
      {
        name: "Si",
        value: this.curulesVotation.approved
      },
      {
        name: "No",
        value: this.curulesVotation.senators.length - this.curulesVotation.approved
      }]

    this.dataNo = [
      {
        name: "Si",
        value: this.curulesVotation.senators.length - this.curulesVotation.rejected
      },
      {
        name: "No",
        value: this.curulesVotation.rejected
      }]



    this.darwChartPieSi(this.dataSi, 'si')
    this.darwChartPieNo(this.dataNo, 'no')
  }


  votation($event) {
    console.log($event)
    let si = [];
    let no = []

    let votos = $event.filter(s => {
      if (s.vote) {
        si.push(s)
      }

      if (s.vote == false) {
        no.push(s)
      }

    })

    this.dataSi = [
      {
        name: "Si",
        value: si.length
      },
      {
        name: "No",
        value: this.curulesVotation.senators.length - si.length
      }]

    this.dataNo = [{
      name: "Si",
      value: this.curulesVotation.senators.length - no.length
    },
    {
      name: "No",
      value: no.length
    }]

    this.darwChartPieSi(this.dataSi, 'si')
    this.darwChartPieNo(this.dataNo, 'no')

  }

  updateView($event) {
    this.loading = true;
    this.endpoint.apiGet(`plenaries/${this.session.id}`)
      .subscribe(response => {
        this.loading = false;
        this.sessionData = response;
        // this.projects = this.sessionData.data

        let pro = []
        for (let p of response.data) {
          pro.push(p.project)
        }

        this.projects = pro;
      }, error => {
        this.loading = false;
        this.notify.error(error)
      })
  }


  updatePlenarySesion(){

    // console.log(this.sessionData.data)

    this.endpoint.apiPut(`plenaries/plenary/${this.session.id}`, {data:this.sessionData.data})
      .subscribe(response=>{
        // console.log(response)
        this.sendUpdate.emit(response);
        this.fadeOut('sessionsNew')
        // this.sessionData = null; 
        this.curulesVotation = undefined;
      }, error=>{
        this.notify.error(error)
      })
      
      // this.sendUpdate.emit(this.sessionData);
      // console.log(this.sessionData.data)

  }

  cancel(){
    // this.sessionData = null; 
    this.curulesVotation = undefined;
  }

  darwChartPieSi(data, element) {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart(element, {
        "type": "pie",
        "theme": "light",
        "labelRadius": -1,
        "radius": "42%",
        "innerRadius": "60%",
        "valueField": "value",
        "titleField": "name",
        "outlineColor": "#FFFFFF",
        "outlineAlpha": 0.4,
        "outlineThickness": 1,
        "startDuration": 0,
        "fontSize": 9,
        "colors": ['#3DAE55', '#EEEEEE'],
        "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
        "export": {
          "enabled": false
        },
        "labelFunction": function (item, label) {
          return (label.indexOf('No') > -1) ? "" : label;
        },
        "dataProvider": data
      });
    })
  }

  darwChartPieNo(data, element) {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart(element, {
        "type": "pie",
        "theme": "light",
        "labelRadius": -1,
        "radius": "42%",
        "innerRadius": "60%",
        "valueField": "value",
        "titleField": "name",
        "outlineColor": "#FFFFFF",
        "outlineAlpha": 0.4,
        "outlineThickness": 1,
        "startDuration": 0,
        "fontSize": 9,
        "colors": ['#EEEEEE', '#F81D00'],
        "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
        "export": {
          "enabled": false
        },
        "labelFunction": function (item, label) {
          return (label.indexOf('Si') > -1) ? "" : label;
        },
        "dataProvider": data
      });
    })
  }


  changeText() {
    if(this.mapa == false){
      this.curulesVotation.project.pivot.status = "2"
      this.text = "Votado"
    }else{
      this.curulesVotation.project.pivot.status = "3"
      this.text = "Por votar"
    }
  }
}