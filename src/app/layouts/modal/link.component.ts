import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'modal-link',
  templateUrl: './link.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalLinkComponent {

  @Input() address : string;

}
