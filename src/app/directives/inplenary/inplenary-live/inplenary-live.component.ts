import { NotifyService } from './../../../services/notify.service';
import { EndPointsService } from './../../../services/endpoints.service';
import { Router } from '@angular/router';
import { GeneralService } from './../../../services/general.service';
import { DataFake } from './../../../controllers/notifications/notifications/dataFake';
import { Component, OnInit, ElementRef } from '@angular/core';
import { CurulesService } from 'app/services/curules.service';
import { Controller } from 'app/controllers/controller.component';


declare var $: any;

@Component({
  selector: 'app-inplenary-live',
  templateUrl: './inplenary-live.component.html',
  styleUrls: ['./inplenary-live.component.scss']
})
export class InplenaryLiveComponent extends Controller implements OnInit {
  // export class InplenaryLiveComponent implements OnInit {
  mapa: boolean = true;
  text: string = "Mapa";
  senators: any[] = [];
  resultsSearch: any[] = [];
  inputSearch: string = '';
  noResult: boolean = false;
  inDiscussion: boolean = true;

  votations: any[] = [];

  iconChange: boolean = false;
  votoSi: boolean = true;
  textoVoto: string = 'Si';
  inputSearchProject: string = '';
  resultsSearchProject: any[] = [];
  noResultProject: boolean = false;

  loading: boolean = false;

  urlStreaming: string;
  idProjectSelected: number;

  constructor(public df: DataFake,
    public _curulesService: CurulesService,
    public _generalService: GeneralService,
    public _endPointService: EndPointsService,
    public _notifyService: NotifyService,
    public el: ElementRef,
    public router: Router) {
    super(el)
  }



  ngOnInit() {

    this._curulesService.bills = this._generalService.activePlenary.projects
    // this.getBills();

  }


  changeText() {
    this.mapa ? this.text = "Mapa" : this.text = "Listado";
  }

  changeVoto() {
    if (this.votoSi) {
      this.textoVoto = 'Si';
      this._curulesService.billPlay.reference = 'si';
    } else {
      this.textoVoto = 'No';
      this._curulesService.billPlay.reference = 'no';
    }

  }

  changeIcon() {
    this.iconChange ? this.iconChange = false : this.iconChange = true;

    $('#votacion').collapse('toggle')

  }

  searchSenator() {
    let r: any;
    if (this.inputSearch.length != 0) {
      r = this.objectFindByKey(this._curulesService.arrayCurules, 'fullname', this.inputSearch);

      if (r != undefined) {
        this.resultsSearch = r
        this.noResult = false;
      } else {
        this.resultsSearch = [];
        this.noResult = true;
      }
    } else {
      this.resultsSearch = [];
      this.noResult = true;
    }
  }

  //Busqueda
  objectFindByKey(array, key, value) {
    let res = []
    for (var i = 0; i < array.length; i++) {
      // if (array[i][key].includes(value)) {
      if (array[i][key].indexOf(value) != -1) {
        res.push(array[i])
        //console.log(array[i])
      }
    }

    if (res.length != 0) {
      return res
    }

  }


  votation($event) {
    this.votations.push($event)
  }

  setear() {
    this.votations = [];
  }

  asistencia($event) {
    // console.log($event)
    let asistencia = [];
    for (let c of $event) {
      if (c.attend && !this.objectFindByKeyBoolean(asistencia, 'id', c.id)) {
        asistencia.push(c)
      }
    }
    // console.log(asistencia)
    this._curulesService.totalAsistencia = asistencia
    //console.log($event)
    if (this._curulesService.billPlay) {
      this._curulesService.billPlay.senators = $event;
      //console.log(this._curulesService.billPlay.senators)
    }
  }

  asistenciaPut($event) {
    // console.log($event)
    this._endPointService.apiPut("plenaries/assistances/" + this._generalService.activePlenary.id, { senator_id: $event.id })
      .subscribe(response => {
        this.getAsistances()
      }, error => {
        this._notifyService.error(error)
        console.log(error);
      })
  }

  objectFindByKeyBoolean(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return true;
      }
    }
    return false;
  }

  searchBill() {
    let r: any;
    if (this.inputSearchProject.length != 0) {
      r = this.objectFindByKey(this._curulesService.bills, 'name', this.inputSearchProject);
      // console.log(r)
      if (r != undefined) {
        this.resultsSearchProject = r
        this.noResultProject = false;
      } else {
        this.resultsSearchProject = [];
        this.noResult = true;
      }
    } else {
      this.resultsSearchProject = [];
      this.noResultProject = true;
    }
  }

  urlRecived($event) {
    this._generalService.urlStreaming = $event;
  }


  destroyPlenary() {
    this._endPointService.apiDelete('plenaries/' + this._generalService.activePlenary.id)
      .subscribe(response => {
        this._generalService.plenaria = 'no hay'
        this._generalService.bills = [];
        this._generalService.activePlenary = undefined;
        this._curulesService.arrayCurulesAsistencia = [];
        this._curulesService.arrayCurules = [];
        this.router.navigate(["/events"])
      }, error => {
        this._notifyService.error(error)
      })
  }


  updateStatePlenary() {
    // console.log(this._curulesService.billPlay.id)
    this._endPointService.apiPut('plenaries/projects/' + this._generalService.activePlenary.id, { project_id: this._curulesService.billPlay.id })
      .subscribe(response => {
        // console.log(response)
      }, error => {
        console.log(error)
        this._notifyService.error(error)
      })
  }


  getAsistances() {
    this._endPointService.apiGet("plenaries/assistances/" + this._generalService.activePlenary.id)
      .subscribe(response => {
        // console.log(response)
        this._curulesService.arrayCurulesAsistencia = response
      }, error => {
        this._notifyService.error(error)
        console.log(error);
      })
  }

  sendAssistances() {
    console.log(this._curulesService.arrayCurulesAsistencia)
    // this.loading = true;
    this._endPointService.apiPut("plenaries/assistances/" + this._generalService.activePlenary.id, { senators: this._curulesService.arrayCurulesAsistencia })
      .subscribe(response => {
        // this.loading = false;
        console.log(response)
        this._curulesService.arrayCurulesAsistencia = response
        this._curulesService.billPlay.senators = this._curulesService.arrayCurulesAsistencia
        // this.senatorsPresence.emit(this._curulesService.arrayCurulesAsistencia)

      }, error => {
        this._notifyService.error(error)
        console.log(error);
      })
  }

  sendData(id) {
    this.idProjectSelected = id;
  }
}
