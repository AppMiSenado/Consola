import { Component, OnInit } from '@angular/core';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

	private view:string = 'sessions';

	private chart: AmChart;

	notificationSelected: any;

  constructor(private AmCharts: AmChartsService) 
  	
  	{
   }

  ngOnInit() {
  }

darwChart(e) {
    setTimeout(() => {
      this.chart = this.AmCharts.makeChart("chartdiv", {
        "type": "pie",
        "theme": "light",
        "labelRadius": 0,
        "radius": "50%",
        "valueField": "value",
        "titleField": "type",
        "outlineColor": "#FFFFFF",
        "outlineAlpha": 0.4,
        "outlineThickness": 1,
        "depth3D": 15,
        "angle": 30,
        "fontSize": 9,
        "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
        "export": {
          "enabled": true
        },
        "dataProvider": this.notificationSelected.information
      });
    })
  }
}
