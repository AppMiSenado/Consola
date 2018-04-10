import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Controller } from '../../../controllers/controller.component';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { EndPointsService } from '../../../services/endpoints.service';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-show-votation',
  templateUrl: './show-votation.component.html',
  styleUrls: ['./search-bill.component.scss']
})

export class ShowVotationComponent extends Controller implements OnInit {
  @Input() data:any;
  project:any;
  private chart: AmChart;
  private colors: Array<string> = [
    '#009432',
    '#EA2027'
  ];
  loading:boolean = false;
  constructor(
    private AmCharts: AmChartsService,
    public el: ElementRef,
    public _endPointsService: EndPointsService,
    public _notifyService: NotifyService) {
    super(el)
  }

  ngOnInit() {
  }

  ngOnChanges(){
    if(this.data){
      this.loading = true;
      this._endPointsService.apiGet('projects/'+this.data)
        .subscribe(response=>{
          this.loading = false;
          this.project = response;
          setTimeout(()=>{
            this.drawChart(this.project)
          }, 100)
        }, error=> {
          this._notifyService.error(error)
          this.loading = false;
        })
    }
  }

  drawChart(project:any){
    let payload:any[] = [{
      type: 'Votos por el si',
      value: project.approved_count,
    },
    {
      type: 'Votos por el no',
      value: project.rejected_count
    }
  ]

    this.chart = this.AmCharts.makeChart("chartdiv", {
      "type": "pie",
      "theme": "light",
      "labelsEnabled": false,
      "radius": "42%",
      "innerRadius": "60%",
      "valueField": "value",
      "fontFamily":"arial",
      "titleField": "type",
      "outlineColor": "#FFFFFF",
      "outlineAlpha": 0.4,
      "outlineThickness": 1,
      "legend": {
        "equalWidths": false,
        "periodValueText": "total: [[value.sum]]",
        "position": "bottom",
        "valueAlign": "center",
        "align": "center"
      },
      "fontSize": 14,
      "balloonText": "[[title]]<br><span style='font-size:12px'><b>[[value]]</b> ([[percents]]%)</span>",
      "colors": this.colors,
      "export": {
        "enabled": false
      },
      "dataProvider": payload
    });
  }

}
