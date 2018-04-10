import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-close',
  templateUrl: './close.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalCloseComponent {

  @Input() id:number;
  @Output() emmiterAccept = new EventEmitter();

  close(){
    this.emmiterAccept.emit({'session_id': this.id});
  }

}