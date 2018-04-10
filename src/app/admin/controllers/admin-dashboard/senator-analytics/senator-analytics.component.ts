import { Component, OnInit, Input, ElementRef} from '@angular/core';
import { Controller } from '../../../../controllers/controller.component';
import { NotifyService } from './../../../../services/notify.service';
import { EndPointsService } from 'app/services/endpoints.service';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector   : 'senator-analytics',
  templateUrl: './senator-analytics.component.html',
  styleUrls  : ['./../admin-dashboard.component.scss']
})

export class SenatorAnalyticsComponent extends Controller implements OnInit {
	
  private chart: AmChart; 
  private votes: Array<any>   = []; 
  private projectname: string = ''; 

	@Input() senator:any;

  constructor( private AmCharts: AmChartsService,
               public el: ElementRef,
               public _endPointsService:EndPointsService,
               public _notifyService:NotifyService) {
    super(el);
  }

  ngOnInit(){
    this.senator = {
        fullname: '',
      };
  }

  ngOnChanges() {
    if(this.senator !== undefined){
      this._endPointsService.apiGet('analytics/senatorsvotes/' + this.senator.id).subscribe(
          response => {
            
            response.votes.forEach( item =>{
              this.votes.push({
                project : item.project.name,
                voted_at : item.project.voted_at,
                approved : (item.vote == 1) ?  'Si' : 'No',
              });
            });

            let data = [
              {
                name: "Si",
                value: response.approved_count
              },
              {
                name: "No",
                value: response.rejected_count
              }];

            this.darwChartPieApproved(data, "chartdiv-approved");
            this.darwChartPieRejected(data, "chartdiv-rejected");
            this.darwChartAssistances(response.assistances, "chartdiv-assistances");
          },
          error    => this.notify.error(error),
        );
    }
  }

  darwChartPieApproved(data, element) {
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
        "colors": ['#3DAE55','#EEEEEE'],
        "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
        "export": {
          "enabled": false
        },
        "labelFunction": function(item, label) {
          return ( label.indexOf('No') > -1 ) ? "" : label;
        },
        "dataProvider": data
      });
    })
  }

  darwChartPieRejected(data, element) {
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
        "colors": ['#EEEEEE','#F81D00'],
        "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
        "export": {
          "enabled": false
        },
        "labelFunction": function(item, label) {
          return ( label.indexOf('Si') > -1 ) ? "" : label;
        },
        "dataProvider": data
      });
    })
  }

  darwChartAssistances(data, element) {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart(element, {
        "type": "serial",
        "theme": "light",
        "marginRight": 40,
        "marginLeft": 40,
        "autoMarginOffset": 20,
        "mouseWheelZoomEnabled":true,
        "dataDateFormat": "YYYY-MM-DD",
        "valueAxes": [{
            "id": "v1",
            "axisAlpha": 0,
            "position": "left",
            "ignoreAxisWidth":true
        }],
        "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0
        },
        "graphs": [{
            "id": "g1",
            "showBalloon":false,
            "bullet": "round",
            "bulletBorderAlpha": 1,
            "bulletColor": "#FFFFFF",
            "bulletSize": 5,
            "hideBulletsCount": 50,
            "lineThickness": 2,
            "title": "red line",
            "useLineColorForBulletBorder": true,
            "valueField": "assistance"
        }],
        "chartScrollbar": {
            "graph": "g1",
            "oppositeAxis":false,
            "offset":30,
            "scrollbarHeight": 80,
            "backgroundAlpha": 0,
            "selectedBackgroundAlpha": 0.1,
            "selectedBackgroundColor": "#888888",
            "graphFillAlpha": 0,
            "graphLineAlpha": 0.5,
            "selectedGraphFillAlpha": 0,
            "selectedGraphLineAlpha": 1,
            "autoGridCount":true,
            "color":"#AAAAAA"
        },
        "chartCursor": {
            "pan": true,
            "valueLineEnabled": true,
            "valueLineBalloonEnabled": true,
            "cursorAlpha":1,
            "cursorColor":"#258cbb",
            "limitToGraph":"g1",
            "valueLineAlpha":0.2,
            "valueZoomable":true
        },
        "categoryField": "start_at",
        "categoryAxis": {
            "parseDates": true,
            "dashLength": 1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": false
        },
        "dataProvider": data
      });
    })
  }

  generateCSV(){
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      useBom: true
    };

    let data = [];
    for(let vote of this.votes) {
      data.push({
        "Proyecto de ley": vote.project,
        "Fecha": vote.voted_at,
        "Votación": vote.approved,
      });
    }

    new Angular2Csv(data, 'Reporte - Historial de votación '+this.senator.fullname, options);
  }

}