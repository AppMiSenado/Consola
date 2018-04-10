import { GeneralService } from './../../../services/general.service';
import { NotifyService } from './../../../services/notify.service';
import { EndPointsService } from './../../../services/endpoints.service';
import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {
  @Input() create:boolean;
  @Input() categories: any[];
  @Input() categotegoriesAll: any[]
  @Input() buttons: boolean = false;
  @Input() search: boolean = false;
  @Input() categoriesSelectedInput: any;
  @Input() categoriasSeleccionadas: any[];
  @Output() categoriesEmmit = new EventEmitter();
  bills: any[]

  categoriesSelected: any[] = []
  inputSearch: string;
  resultsSearch: any;
  showResult: boolean = false;

  @Input() resetear:boolean = false;

  constructor(private el: ElementRef,
    private _endPointService: EndPointsService) { }

  ngOnInit() {
    setTimeout(() => {
      this.bills = this.categotegoriesAll;
      this.checkBills()
    }, 5000)

  }

  ngOnChanges() {
    if (this.categoriasSeleccionadas) {
      this.check()
    }

    
    if( this.bills){
      // this.bills= []
      this.categoriesSelected = []
      this.bills.forEach(b=>{
        b.selected = false;
      })

      setTimeout(() => {
        this.bills = this.categotegoriesAll;
        this.checkBills()
      }, 1000)

    }

    if(this.resetear){
      this.reset()
    }
  }

  selected(categorie) {
    // console.log("aca")

    if (!this.objectFindByKeyBoolean(this.categoriesSelected, 'id', categorie.id)) {
      this.categoriesSelected.push(categorie);
      if (this.categories) {
        for (var i = 0; i < this.categories.length; i++) {
          if (this.categories[i]['id'] == categorie.id) {
            this.categories[i].selected = true;
          }
        }
      }

    } else {
      this.objectFindByKeyAndRemove(this.categoriesSelected, 'id', categorie.id)
      if (this.categories) {
        for (var i = 0; i < this.categories.length; i++) {
          if (this.categories[i]['id'] == categorie.id) {
            this.categories[i].selected = false;
          }
        }
      }
    }

    if(this.create == true){
      this.categoriesEmmit.emit(this.categoriesSelected)
    }

  }


  selectedBills(categorie) {


    if (!this.objectFindByKeyBoolean(this.categoriesSelected, 'id', categorie.id)) {
      this.categoriesSelected.push(categorie);
      for (var i = 0; i < this.bills.length; i++) {
        if (this.bills[i]['id'] == categorie.id) {
          this.bills[i].selected = true;
        }
      }
    }

    this.categoriesEmmit.emit(this.categoriesSelected)

  }

  reset() {
    for (var i = 0; i < this.categories.length; i++) {
      this.categories[i].selected = false;
    }
    this.categoriesSelected = []
    this.categoriesEmmit.emit(this.categoriesSelected)
  }

  selectAll() {
    this.categoriesSelected = []
    console.log(this.categories)

    for (var i = 0; i < this.categories.length; i++) {

      this.categories[i].selected = true;

      this.categoriesSelected.push(this.categories[i])
    }

    this.categoriesEmmit.emit(this.categoriesSelected)
  }

  objectFindByKeyBoolean(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return true;
      }
    }
    return false;
  }


  objectFindByKeyAndRemove(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        array.splice(i, 1);
      }
    }
  }


  checkBills() {
    if (this.categoriesSelectedInput) {
      for (let c of this.categoriesSelectedInput) {
        this.selectedBills(c)
      }
    }
  }

  check() {

    for (let c of this.categoriasSeleccionadas) {
      // console.log(c)
      this.selected(c)
    }
    this.categoriesEmmit.emit(this.categoriesSelected)
    this.categoriesSelected = []
  }

  //Busqueda
  searchCategorie() {
    let r: any;
    if (this.inputSearch) {
      r = this.objectFindByKey(this.bills, 'name', this.inputSearch);
      if (r.length != 0) {
        this.resultsSearch = r
        this.showResult = true;
      } else {
        this.resultsSearch = undefined;
        this.showResult = true;
      }
    }
    else {
      this.resultsSearch = undefined;
      this.showResult = false;
    }
  }


  objectFindByKey(array, key, value) {
    let res = []
    for (var i = 0; i < array.length; i++) {
      if (array[i][key].indexOf(value) != -1) {
        res.push(array[i])
      }
    }
    return res
  }

}