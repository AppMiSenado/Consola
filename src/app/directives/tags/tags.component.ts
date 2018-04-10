import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ng2-uberflug-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {

  @Input() items: Array<any> = [];
  @Output() emmiteItems = new EventEmitter();

  ngOnChanges() {
    if( this.items === undefined ){
      this.items = [];
    }
  }

  add(tag){
    this.items.push(tag);
  }

  remove(index){
    this.items.splice(index, 1);
    this.emmiteItems.emit( this.items );
  }
}
