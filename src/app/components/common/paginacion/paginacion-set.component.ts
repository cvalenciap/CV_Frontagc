import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pagination-set',
  template: `
      Mostrar
      <div class="btn-group" dropdown [dropup]="true">
        <button dropdownToggle type="button" class="btn btn-sm dropdown-toggle" aria-controls="dropdown-dropup">
          {{selectedOption}} <span class="caret"></span>
        </button>
        <ul *dropdownMenu class="dropdown-menu" role="menu">
          <li role="menuitem" *ngFor="let p of pagingOptions"><a class="dropdown-item" (click)="change(p)">{{p}}</a></li>
        </ul>
      </div>
      registros por página.
  `
})
export class PaginacionSetComponent {

  pagingOptions: number[] = [10, 20, 50, 100];
  defaultOption = 10;
  @Input('rows')
  selectedOption: number = this.defaultOption;
  @Output() optionChanged = new EventEmitter<any>();

  constructor() {}

  change(option) {
    this.selectedOption = option;
    this.optionChanged.emit({
      rows: this.selectedOption
    });
  }
}
