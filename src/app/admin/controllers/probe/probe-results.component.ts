import { EndPointsService } from 'app/services/endpoints.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'app/services/notify.service';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  selector: 'probe-results',
  templateUrl: './probe-results.component.html',
  styleUrls: ['./probe.component.scss']
})
export class ProbeResultsComponent implements OnInit {

  probe: any;

  id: number;
  private chart: AmChart;
  public colors: Array<string> = [
    '#218c74',
    '#e74c3c',];

  public colorsGender: Array<string> = [
    '#ff7675',
    '#3498db',
    ];

  public loading:boolean = false;

  constructor(private route: ActivatedRoute,
    private _endPointService: EndPointsService,
    private AmCharts: AmChartsService,
    private _notifyService: NotifyService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id

      this.getProbe()

    });

  }


  getProbe() {
    this.loading = true;
    this._endPointService.apiGet(`surveys/${this.id}`)
      .subscribe(response => {
        // console.log(response)
        this.loading = false;
        this.probe = response;

        setTimeout(()=>{
          this.darwChartVoteDate()
          this.darwChartGenerals()
          this.darwChartDepartament()
          this.darwChartAges()
        }, 100)

      }, error => {
        this._notifyService.error(error)
        this.loading = false;
      })
  }


  darwChartVoteDate() {
    let payload = []

    this.probe[0].votes_date.forEach(p => {
      payload.push({
        fecha: p.date,
        si: p.vote_true,
        no: p.vote_false
      })
    })

    this.chart = this.AmCharts.makeChart("voteDate",
      {
        "type": "serial",
        "theme": "light",
        "categoryField": "fecha",
        "rotate": true,
        "colors": this.colors,
        "startDuration": 1,
        "categoryAxis": {
          "gridPosition": "start",
          "position": "left"
        },
        "trendLines": [],
        "graphs": [
          {
            "balloonText": "Si:[[value]]",
            "fillAlphas": 0.8,
            "id": "AmGraph-1",
            "lineAlpha": 0.2,
            "title": "Si",
            "type": "column",
            "valueField": "si"
          },
          {
            "balloonText": "No:[[value]]",
            "fillAlphas": 0.8,
            "id": "AmGraph-2",
            "lineAlpha": 0.2,
            "title": "No",
            "type": "column",
            "valueField": "no"
          }
        ],
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
        "dataProvider": payload
      }
    );
  }

  darwChartGenerals() {
    let payloadDepartament = []
    let payloadGender = [
      {
        Genero: "Femenino",
        Votos: this.probe[0].votes_gender.vote_female_count
      },
      {
        Genero: "Masculino",
        Votos: this.probe[0].votes_gender.vote_male_count
      }
    ]
    let payloadAge = []

    let payloadFemale = [{
      label: "Si",
      Votos: this.probe[0].votes_gender.vote_female_true_count,
    },
    {
      label: "No",
      Votos: this.probe[0].votes_gender.vote_female_false_count
    }
    ]

    let payloadMale = [
      {
        label: "Si",
        Votos: this.probe[0].votes_gender.vote_male_true_count,
      },
      {
        label: "No",
        Votos: this.probe[0].votes_gender.vote_male_false_count
      }
    ]
    this.probe[0].votes_departments.forEach(v => {
      payloadDepartament.push({
        Departamento: v.department,
        Votos: v.vote_total
      })
    })

    this.probe[0].votes_range.forEach(v => {
      payloadAge.push({
        Rango: v.range,
        Votos: v.vote_total
      })
    });


    this.chart = this.AmCharts.makeChart("departament", {
      "type": "pie",
      "theme": "light",
      "labelRadius": 0,
      "radius": "42%",
      "innerRadius": "60%",
      "valueField": "Votos",
      "titleField": "Departamento",
      "titles": [{
        "text": "Departamentos",
        "fontFamily": "Arial, Helvetica",
        "size": 10
      }],
      "labelsEnabled": false,
      "outlineColor": "#FFFFFF",
      "outlineAlpha": 0.4,
      "outlineThickness": 1,
      "fontSize": 9,
      "balloonText": "[[Departamento]]<br><span style='font-size:12px'><b>[[Votos]]</b> ([[percents]]%)</span>",
      // "colors": this.colors,
      "export": {
        "enabled": false
      },
      "dataProvider": payloadDepartament
    });


    this.chart = this.AmCharts.makeChart("gender", {
      "type": "pie",
      "theme": "light",
      "labelRadius": -30,
      "radius": "42%",
      "innerRadius": "60%",
      "valueField": "Votos",
      "titleField": "Genero",
      "colors": this.colorsGender,
      "titles": [{
        "text": "Genero",
        "fontFamily": "Arial, Helvetica",
        "size": 8
      }],
      // "labelsEnabled": false,
      "outlineColor": "#FFFFFF",
      "outlineAlpha": 0.4,
      "outlineThickness": 1,
      "fontSize": 9,
      "balloonText": "[[Genero]]<br><span style='font-size:12px'><b>[[Votos]]</b> ([[percents]]%)</span>",
      // "colors": this.colors,
      "export": {
        "enabled": false
      },
      "dataProvider": payloadGender
    });

    this.chart = this.AmCharts.makeChart("female", {
      "type": "pie",
      "theme": "light",
      "labelRadius": -30,
      "radius": "42%",
      "innerRadius": "60%",
      "valueField": "Votos",
      "titleField": "label",
      "colors": this.colors,
      "titles": [{
        "text": "Femenino",
        "fontFamily": "Arial, Helvetica",
        "size": 12
      }],
      // "labelsEnabled": false,
      "outlineColor": "#FFFFFF",
      "outlineAlpha": 0.4,
      "outlineThickness": 1,
      "fontSize": 9,
      "balloonText": "[[label]]<br><span style='font-size:12px'><b>[[Votos]]</b> ([[percents]]%)</span>",
      // "colors": this.colors,
      "export": {
        "enabled": false
      },
      "dataProvider": payloadFemale
    });

    this.chart = this.AmCharts.makeChart("male", {
      "type": "pie",
      "theme": "light",
      "labelRadius": -30,
      "radius": "42%",
      "innerRadius": "60%",
      "valueField": "Votos",
      "titleField": "label",
      "colors": this.colors,
      "titles": [{
        "text": "Masculino",
        "fontFamily": "Arial, Helvetica",
        "size": 12
      }],
      // "labelsEnabled": false,
      "outlineColor": "#FFFFFF",
      "outlineAlpha": 0.4,
      "outlineThickness": 1,
      "fontSize": 9,
      "balloonText": "[[label]]<br><span style='font-size:12px'><b>[[Votos]]</b> ([[percents]]%)</span>",
      // "colors": this.colors,
      "export": {
        "enabled": false
      },
      "dataProvider": payloadMale
    });
  }

  darwChartDepartament() {

    let payload = []

    this.probe[0].votes_departments.forEach(v => {

      if (v.vote_total != "0") {
        payload.push({
          Departament: v.department,
          Si: v.vote_true,
          No: v.vote_false
        })
      }
    });

    // console.log(payload)

    this.chart = this.AmCharts.makeChart("departamens",

      {
        "type": "serial",
        "theme": "light",
        "colors": this.colors,
        "legend": {
          "autoMargins": false,
          "borderAlpha": 0.1,
          "equalWidths": true,
          "horizontalGap": 10,
          "markerSize": 10,
          "useGraphSettings": false,
          "align": "center",
          "valueAlign": "center",
          "valueWidth": 20
        },
        "dataProvider": payload,
        "titles": [{
          "text": "Votación por Departamento",
          "fontFamily": "Arial, Helvetica",
          "size": 14
        }],
        "valueAxes": [{
          "stackType": "100%",
          "axisAlpha": 0,
          "gridAlpha": 0,
          "labelsEnabled": false,
          "position": "left"
        }],
        "graphs": [{
          "balloonText": "[[title]], [[category]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>",
          "fillAlphas": 0.9,
          "fontSize": 11,
          "labelText": "[[percents]]%",
          "lineAlpha": 0.5,
          "title": "Si",
          "type": "column",
          "valueField": "Si"
        }, {
          "balloonText": "[[title]], [[category]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>",
          "fillAlphas": 0.9,
          "fontSize": 11,
          "labelText": "[[percents]]%",
          "lineAlpha": 0.5,
          "title": "No",
          "type": "column",
          "valueField": "No"
        }],
        "marginTop": 30,
        "marginRight": 0,
        "marginLeft": 0,
        "marginBottom": 40,
        "autoMargins": false,
        "categoryField": "Departament",
        "categoryAxis": {
          "gridPosition": "start",
          "axisAlpha": 0,
          "gridAlpha": 0
        },
        "export": {
          "enabled": false
        }

      }
    )
  }

  darwChartAges() {

    let payload = []

    this.probe[0].votes_range.forEach(v => {

      if (v.vote_total != "0") {
        payload.push({
          Departament: v.range,
          Si: v.vote_true,
          No: v.vote_false
        })
      }
    });

    // console.log(payload)

    this.chart = this.AmCharts.makeChart("ages",

      {
        "type": "serial",
        "theme": "light",
        "colors": this.colors,
        "legend": {
          "autoMargins": false,
          "borderAlpha": 0.1,
          "equalWidths": true,
          "horizontalGap": 10,
          "markerSize": 10,
          "useGraphSettings": false,
          "align": "center",
          "valueAlign": "center",
          "valueWidth": 20
        },
        "dataProvider": payload,
        "titles": [{
          "text": "Votación por rango de edades",
          "fontFamily": "Arial, Helvetica",
          "size": 14
        }],
        "valueAxes": [{
          "stackType": "100%",
          "axisAlpha": 0,
          "gridAlpha": 0,
          "labelsEnabled": false,
          "position": "left"
        }],
        "graphs": [{
          "balloonText": "[[title]], [[category]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>",
          "fillAlphas": 0.9,
          "fontSize": 11,
          "labelText": "[[percents]]%",
          "lineAlpha": 0.5,
          "title": "Si",
          "type": "column",
          "valueField": "Si"
        }, {
          "balloonText": "[[title]], [[category]]<br><span style='font-size:14px;'><b>[[value]]</b> ([[percents]]%)</span>",
          "fillAlphas": 0.9,
          "fontSize": 11,
          "labelText": "[[percents]]%",
          "lineAlpha": 0.5,
          "title": "No",
          "type": "column",
          "valueField": "No"
        }],
        "marginTop": 30,
        "marginRight": 0,
        "marginLeft": 0,
        "marginBottom": 40,
        "autoMargins": false,
        "categoryField": "Departament",
        "categoryAxis": {
          "gridPosition": "start",
          "axisAlpha": 0,
          "gridAlpha": 0
        },
        "export": {
          "enabled": false
        }

      }
    )
  }


}