import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'modal-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalDeleteComponent {

  @Input() id: number;
  @Output() emmiterAccept = new EventEmitter(); 

  delete(){
    this.emmiterAccept.emit({'session_id': this.id});
  }

}
