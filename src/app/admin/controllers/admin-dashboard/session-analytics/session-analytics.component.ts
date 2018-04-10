import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { Controller } from '../../../../controllers/controller.component';
import { NotifyService } from './../../../../services/notify.service';
import { EndPointsService } from 'app/services/endpoints.service';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector   : 'session-analytics',
  templateUrl: './session-analytics.component.html',
  styleUrls  : ['./../admin-dashboard.component.scss']
})

export class SessionsAnalyticsComponent extends Controller implements OnInit {

  private chart: AmChart; 
  public colors: Array<string> = [
   '#3DAE55',
   '#F81D00',
   '#7f8c8d',
   '#555555',
   '#FF0000',
   '#33FF00',
   '#CC00FF'];

  section: string = "votaciones";
  currentProjectAsistence: any = {};
  currentProjectVoting: any = {};
	dataAssistance: any = {};
  dataVoting: any = {};
  project: any = null;

  loadDataAsssitance: boolean = false;
  loadDataVotting: boolean = false;

  loading:boolean = false;

	@Input() session:any;

  constructor( private AmCharts: AmChartsService,
               public el: ElementRef,
               public _endPointsService:EndPointsService,
               public _notifyService:NotifyService) {

    super(el)
  }

	ngOnChanges(){
		if(this.session !== undefined && this.session.id){
      this.currentProjectAsistence = {};
      this.currentProjectVoting = {};
      this.loadDataAsssitance = false;
      this.loadDataVotting = false;
			this.getDataAssistance();
      this.getDataVoting();
		}
	}

  ngOnInit() {
  }

  getDataAssistance(){
    this.dataAssistance = {};
  	this._endPointsService.apiGet('analytics/plenaryassistances/'+this.session.id).subscribe(
      response => { 
        this.loadDataAsssitance = true;
      	this.dataAssistance = response 
        this.estructureDataAssistance(this.dataAssistance);
        
      },
      error    => this._notifyService.error(error),
    );
  }

  getDataVoting(){
    this.loading = true;
    this.dataVoting = {};
    this._endPointsService.apiGet('analytics/plenaryvotes/'+this.session.id).subscribe(
      response => { 
        this.loadDataVotting = true;
        this.dataVoting = response 
        this.estructureDataVoting(this.dataVoting);
        this.loading = false;
      },
      error    => {
        this.loading = false;
        this._notifyService.error(error);
      },
    );
  }

  onChangeProjectAssistance(e){
    this.currentProjectAsistence = this.dataAssistance.data[e];
    let data = [
      {
        name: "Asistentes",
        value: this.currentProjectAsistence.present_count
      },
      {
        name: "Ausentes",
        value: this.currentProjectAsistence.missing_count
      }]
    this.darwChartPie(data, "chartdiv-project");

    let columns = [];

    for(let item of this.currentProjectAsistence.parties) {
      columns.push({
        party: item.name,
        assistant: item.present_count,
        absent: item.missing_count
      });
    }

    this.darwChartColumns(columns, "chartdiv-party");
  }

  onChangeProjectVoting(e){
    this.currentProjectVoting = this.dataVoting.data[e]

    // console.log(this.currentProjectVoting)

    let data = [
      {
        name: "Si",
        value: this.currentProjectVoting.approved
      },
      {
        name: "No",
        value: this.currentProjectVoting.rejected
      }]
    this.darwChartPie(data, "chartdiv-voting");


    data = [
      {
        name: "Si",
        value: this.currentProjectVoting.citizens.approved
      },
      {
        name: "No",
        value: this.currentProjectVoting.citizens.rejected
      }]
    this.darwChartPie(data, "chartdiv-citizens");
  }

  estructureDataAssistance(session){
    let data = [
      {
        name: "Asistentes",
        value: session.present_count
      },
      {
        name: "Ausentes",
        value: session.missing_count
      }]
    this.darwChartPie(data, "chartdiv-global");
  }

  estructureDataVoting(session){
    let columns = [];
    for(let item of session.data) {
      columns.push({
        project: item.project.name.substring(0, 30) + '...',
        projectLarge: item.project.name,
        yes: item.approved,
        no: item.rejected
      });
    }

    this.darwChartColumnsVotes(columns, 'chartdiv-projects')
  }

  darwChartPie(data, element) {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart(element, {
        "type": "pie",
        "theme": "light",
        "labelRadius": 0,
        "radius": "42%",
        "innerRadius": "60%",
        "valueField": "value",
        "titleField": "name",
        "outlineColor": "#FFFFFF",
        "outlineAlpha": 0.4,
        "outlineThickness": 1,
        "fontSize": 9,
        "colors": this.colors,
        "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
        "export": {
          "enabled": false
        },
        "dataProvider": data
      });
    })
  }

  darwChartColumns(data, element) {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart(element, {
        "type": "serial",
        "theme": "light",
        "categoryField": "party",
        "rotate": true,
        "startDuration": 1,
        "categoryAxis": {
          "gridPosition": "start",
          "position": "left"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonText": "Presentes:[[value]]",
            "fillAlphas": 0.8,
            "id": "AmGraph-1",
            "lineAlpha": 0.2,
            "title": "Presentes",
            "type": "column",
            "valueField": "assistant"
          },
          {
            "balloonText": "Ausentes:[[value]]",
            "fillAlphas": 0.8,
            "id": "AmGraph-2",
            "lineAlpha": 0.2,
            "title": "Ausentes",
            "type": "column",
            "valueField": "absent"
          }

        ],
        "colors":this.colors,
        "guides": [],
        "valueAxes": [
          {
            "id": "ValueAxis-1",
            "position": "top",
            "axisAlpha": 0
          }
        ],
        "allLabels": [],
        "balloon": {},
        "titles": [],
        "export": {
          "enabled": false
        },
        "dataProvider": data
      });
    })
  }

  darwChartColumnsVotes(data, element) {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart(element, {
        "type": "serial",
        "theme": "light",
        "categoryField": "project",
        "rotate": true,
        "startDuration": 1,
        "categoryAxis": {
          "gridPosition": "start",
          "position": "left"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonText": "Si:[[value]], [[projectLarge]] ",
            "fillAlphas": 0.8,
            "id": "AmGraph-1",
            "lineAlpha": 0.2,
            "title": "Si",
            "type": "column",
            "valueField": "yes"
          },
          {
            "balloonText": "No:[[value]], [[projectLarge]]",
            "fillAlphas": 0.8,
            "id": "AmGraph-2",
            "lineAlpha": 0.2,
            "title": "No",
            "type": "column",
            "valueField": "no"
          }

        ],
        "colors":this.colors,
        "guides": [],
        "valueAxes": [
          {
            "id": "ValueAxis-1",
            "position": "top",
            "axisAlpha": 0
          }
        ],
        "allLabels": [],
        "balloon": {},
        "titles": [],
        "export": {
          "enabled": false
        },
        "dataProvider": data
      });
    })
  }

  generateCSVAssistance(){
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      useBom: true
    };

    let data = [];
    for(let item of this.currentProjectAsistence.senators) {
      data.push({
        "senador": item.fullname,
        "partido": item.party.name,
        "asistió": item.attended ? 'Presente': 'Ausente',
      });
    }

    new Angular2Csv(data, 'Reporte - Sesión '+this.session.created_at+' - '+this.currentProjectAsistence.project.name, options);
  }

  generateCSVVoting(){
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      useBom: true
    };

    let data = [];
    for(let item of this.currentProjectVoting.senators) {
      data.push({
        "senador": item.fullname,
        "partido": item.party.name,
        "votó": item.vote ? 'Si': 'No',
      });
    }

    new Angular2Csv(data, 'Reporte - Sesión '+this.session.created_at+' - '+this.currentProjectVoting.project.name, options);
  }

}