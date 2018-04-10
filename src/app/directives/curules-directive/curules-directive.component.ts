import { GeneralService } from 'app/services/general.service';
import { NotifyService } from './../../services/notify.service';
import { EndPointsService } from './../../services/endpoints.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CurulesService } from './../../services/curules.service';


declare var $: any;


@Component({
  selector: 'app-curules-directive',
  templateUrl: './curules-directive.component.html',
  styleUrls: ['./curules-directive.component.scss']
})
export class CurulesDirectiveComponent implements OnInit {
  @Input() hoverEfect: boolean = false;
  @Input() asistence: boolean = false;
  @Input() enableVotation: boolean = false;
  @Input() presence: boolean = false;
  @Input() red: boolean = false;
  @Input() optionVoto: boolean;
  @Input() asistenciaPlenaria: boolean = false;
  @Input() asistenciaPlenariaSenadores: any;
  @Input() votosPlenaria: boolean = false;
  @Input() votosPlenariaSenadores: any;
  @Input() showCurules: boolean = false;
  @Input() curulesList: any;
  @Input() curulAsignado: any;
  @Input() inputSearch: string;
  @Input() curulesAdmin: any;
  @Input() voteOptionAdmin: any;

  @Output() senatorsClickVotation = new EventEmitter();
  @Output() senatorsPresence = new EventEmitter();
  @Output() curulSelected = new EventEmitter();

  clickedSenators: any[] = [];
  asistencia: any[] = [];

  clientX = 0;
  clientY = 0;
  event: MouseEvent;

  loading: boolean = false;

  public curules: any;

  searchSenator: string;

  constructor(public _curulesService: CurulesService,
    public _endPoint: EndPointsService,
    public _notifyService: NotifyService,
    public _generalService: GeneralService) { }

  ngOnInit() {

    if (!this.curulesAdmin) {
      if (this._curulesService.arrayCurules.length == 0) {
        this.getSenators()

      } else {
        this.getAsistances();
      }
    }

  }

  ngOnChanges() {
    if (this.curulAsignado) {
      this.selectCurul(this.curulAsignado)
    } else {
      if (this.curulesList) {
        for (var i = 0; i < this.curulesList.length; i++) {
          this.curulesList[i].selected = false;
        }
      }
    }

    if(this.asistence && this.presence && this._curulesService.arrayCurulesAsistencia.length == 0){
      console.log("entre")
      this.getAsistances()
    }
  }

  getSenators() {
    this.loading = true;
    this._endPoint.apiGet('senators')
      .subscribe(data => {

        this.loading = false;
        this._curulesService.arrayCurules = data;
        let c: any
        for (c in this._curulesService.arrayCurules) {

          this._curulesService.arrayCurules[c].attend = false;
        }

        this._curulesService.arrayCurulesAsistencia = this._curulesService.arrayCurules;
        this.getAsistances();
      }, error => {
        this.loading = false;
        this._notifyService.error(error)
        console.log(error);
      })
  }


  coordinates(event: MouseEvent): void {
    this.clientX = event.clientX - 100;
    this.clientY = event.clientY + 15;
    let box: any = document.getElementsByClassName('box')

    box[0].style.left = `${this.clientX}px`;
    box[0].style.top = `${this.clientY}px`;

  }


  onEvent(event: MouseEvent, senator?: any): void {
    let box: any = document.getElementsByClassName('box');
    let tooltip: any = document.getElementsByClassName('tooltipo-back');
    let name: any = document.getElementsByClassName('content-name');
    let content: any = document.getElementsByClassName('tooltipo-content');
    let imgSenator: any = document.getElementsByClassName('img-senator');

    if (event.type == 'mouseenter' && this.hoverEfect) {
      box[0].style.visibility = 'visible';
      box[0].style.opacity = 1;
    }

    if (event.type == 'mouseleave') {
      box[0].style.visibility = 'hidden';
      box[0].style.opacity = 0;
    }

    if (senator) {
      tooltip[0].style.backgroundColor = senator.seat.svg.fill;
      name[0].innerHTML = senator.fullname
      imgSenator[0].setAttribute('src', senator.image)
      if (senator.seat.svg.fill == '#FFFFFF' || senator.seat.svg.fill == '#F7E908') {
        content[0].style.color = "#000000";
      } else {
        content[0].style.color = "#FFFFFF";
      }
    }
  }

  clickSenator(s) {
    if (this.enableVotation) {
      // this.clickedSenators.push(s);
      this.senatorsClickVotation.emit(s);

      // Votos
      if (this.optionVoto && this._curulesService.billPlay.senators) {
        for (var i = 0; i < this._curulesService.billPlay.senators.length; i++) {
          if (this._curulesService.billPlay.senators[i]['id'] == s.id) {
            this._curulesService.billPlay.senators[i].vote = true;
          }
        }

      } else {
        for (var i = 0; i < this._curulesService.billPlay.senators.length; i++) {
          if (this._curulesService.billPlay.senators[i]['id'] == s.id) {
            this._curulesService.billPlay.senators[i].vote = false;
          }
        }
      }

    }

    // Asistencia
    if (this.presence == true && this._curulesService.arrayCurulesAsistencia) {
      if (s.attend == false) {
        for (var i = 0; i < this._curulesService.arrayCurulesAsistencia.length; i++) {
          if (this._curulesService.arrayCurulesAsistencia[i]['id'] == s.id) {
            this._curulesService.arrayCurulesAsistencia[i].attend = true;
          }
        }

      } else {
        for (var i = 0; i < this._curulesService.arrayCurulesAsistencia.length; i++) {
          if (this._curulesService.arrayCurulesAsistencia[i]['id'] == s.id) {
            this._curulesService.arrayCurulesAsistencia[i].attend = false;
          }
        }
      }
      console.log(s.id)

      // console.log(this._curulesService.arrayCurulesAsistencia)
      // this.loading = true;
      // this._endPoint.apiPut("plenaries/assistances/" + this._generalService.activePlenary.id, { senator_id: s.id })
      //   .subscribe(response => {
      //     // this.loading = false;
      //     this.getAsistances()

      //   }, error => {
      //     this._notifyService.error(error)
      //     console.log(error);
      //   })

    }

  }

  sendAssistances(){
    console.log(this._curulesService.arrayCurulesAsistencia)
      // this.loading = true;
      this._endPoint.apiPut("plenaries/assistances/" + this._generalService.activePlenary.id, { senators:this._curulesService.arrayCurulesAsistencia })
        .subscribe(response => {
          // this.loading = false;
          // this.getAsistances()
          console.log(response)
          this._curulesService.arrayCurulesAsistencia = response
          this._curulesService.billPlay.senators = this._curulesService.arrayCurulesAsistencia
          this.senatorsPresence.emit(this._curulesService.arrayCurulesAsistencia)

        }, error => {
          this._notifyService.error(error)
          console.log(error);
        })
  }

  selectCurul(s) {
    if (s.selected == false || !s.selected) {
      for (var i = 0; i < this.curulesList.length; i++) {
        if (this.curulesList[i]['id'] == s.id) {
          this.curulesList[i].selected = true;
        } else {
          this.curulesList[i].selected = false;
        }
      }

    } else {
      for (var i = 0; i < this.curulesList.length; i++) {
        if (this.curulesList[i]['id'] == s.id) {
          this.curulesList[i].selected = false;
        } else {
          return
        }
      }
    }

    // console.log(s.id)

    this.curulSelected.emit(s.id);

  }

  getAsistances() {
    // this.loading = true;
    if (this._generalService.activePlenary) {
      this._endPoint.apiGet("plenaries/assistances/" + this._generalService.activePlenary.id)
        .subscribe(response => {
          // this.loading = false;
          //console.log(response)
          this._curulesService.arrayCurulesAsistencia = response
          this._curulesService.billPlay.senators = this._curulesService.arrayCurulesAsistencia
          this.senatorsPresence.emit(this._curulesService.arrayCurulesAsistencia)
        }, error => {
          // this.loading = false;
          this._notifyService.error(error)
          console.log(error);
        })
    }

  }

  removeFromArray(array, idx) {
    const objIndex = array.findIndex(o => {
      //console.log(o.id, idx)
      o.id === idx;
    })

    //console.log(objIndex)
    if (objIndex == -1) {
      array.splice(objIndex, 1)
      //console.log(array)
      return array;
    }
  }

  findSenator() {
    let result;

    if (this.searchSenator) {

      for (let c of this._curulesService.arrayCurules) {
        c.fullname = c.fullname.toLowerCase()
      }

      result = this.objectFindByKey(this._curulesService.arrayCurules, "fullname", this.searchSenator.toLowerCase())

      for (let r of this._curulesService.arrayCurules) {
        // console.log(r)
        let x = this.objectFindByKeyBoolean(result, 'id', r.id);
        if (x == true) {
          r.result = true;
        } else {
          r.result = false;
        }
      }

    }
    else {
      for (let c of this._curulesService.arrayCurules) {
        c.result = false;
      }
    }
  }



  voteAdmin(s) {
    // console.log(this.voteOptionAdmin)
    // console.log(s)
    if (this.voteOptionAdmin == "si" && this.curulesAdmin) {
      for (var i = 0; i < this.curulesAdmin.length; i++) {
        if (this.curulesAdmin[i]['id'] == s.id) {
          this.curulesAdmin[i].vote = true;
          this.curulesAdmin[i].attended = true;
          // console.log(this.curulesAdmin[i])
        }
      }

    }

    if (this.voteOptionAdmin == "no" && this.curulesAdmin) {
      for (var i = 0; i < this.curulesAdmin.length; i++) {
        if (this.curulesAdmin[i]['id'] == s.id) {
          this.curulesAdmin[i].vote = false;
          this.curulesAdmin[i].attended = true;
        }
      }
    }

    if (this.voteOptionAdmin == null && this.curulesAdmin) {
      for (var i = 0; i < this.curulesAdmin.length; i++) {
        if (this.curulesAdmin[i]['id'] == s.id) {
          this.curulesAdmin[i].vote = null;
          this.curulesAdmin[i].attended = null;
        }
      }
    }

    this.senatorsClickVotation.emit(this.curulesAdmin);

  }
  objectFindByKeyBoolean(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return true;
      }
    }
    return false;
  }

  objectFindByKey(array, key, value) {
    let res = []
    for (var i = 0; i < array.length; i++) {
      // if (array[i][key].includes(value)) {
      if (array[i][key].indexOf(value) != -1) {
        res.push(array[i])
        //console.log(array[i])
      }
    }
    return res
    // if (res.length != 0) {
    //   return res
    // } else {
    //   return res
    // }

  }


}
