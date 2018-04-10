import { EndPointsService } from 'app/services/endpoints.service';
import { Component, Input, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Controller } from 'app/controllers/controller.component';
import { GeneralService } from 'app/services/general.service';
import { NotifyService } from './../../../services/notify.service';


@Component({
  selector: 'app-new-url-streaming',
  templateUrl: './new-url-streaming.component.html',
  styleUrls: ['./new-url-streaming.component.scss']
})
export class NewUrlStreamingComponent extends Controller implements OnInit {

  urlYoutube: string = 'https://www.youtube.com/embed/'
  streamingCode: string;
  urlVideo: string;

  @Input() startPlenary: boolean;
  @Output() emmiterUrl = new EventEmitter();

  constructor(public el: ElementRef,
    public _generalService: GeneralService,
    public _endPointService: EndPointsService,
    public _notifyService: NotifyService,
    public router: Router) {
    super(el);

  }

  ngOnInit() {
    this.setUrlCode()
  }


  setUrl() {
    if (this.streamingCode) {
      this.urlVideo = this.urlYoutube + this.streamingCode + "?rel=0&amp;showinfo=0"
      this.emmiterUrl.emit(this.urlVideo)
    } else {
      this.urlVideo = undefined;
      this.emmiterUrl.emit(this.urlVideo)
    }
  }

  iniciar() {
    this._endPointService.apiPut("plenaries/open/" + this._generalService.activePlenary.id, { livestreaming: this.urlVideo })
      .subscribe(response => {
        this._generalService.edit = true;
        this._generalService.activePlenary = response;
        console.log(this._generalService.activePlenary)
        this._generalService.plenaria = 'en vivo'
        this.setUrlCode();
        this.router.navigate(['/inplenary-live'])
      }, error => {
        this._notifyService.error(error)
      })


    this._generalService.inLive = true;
  }

  setPlenary() {
    this._generalService.plenaria = 'en vivo'
    this.router.navigate(['/inplenary-live'])
  }

  editStreaming() {
    this._endPointService.apiPut("plenaries/livestreaming/" + this._generalService.activePlenary.id, { livestreaming: this.urlVideo })
      .subscribe(response => {
        // console.log(response)
        this._generalService.activePlenary = response;
        this.setPlenary()
      }, error => {
        this._notifyService.error(error)
      })
  }

  setUrlCode() {
    if (this._generalService.activePlenary && this._generalService.activePlenary) {
      setTimeout(()=>{
        let first = this._generalService.activePlenary.livestreaming.split('/')
        let second = first[4].split(['?'])
        this.streamingCode = second[0]
        this.urlVideo = this._generalService.activePlenary.livestreaming;
      }, 4000)
      // streamingCode:string;
    }
  }

}
