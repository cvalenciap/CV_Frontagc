import { Component, Input } from '@angular/core';

@Component({
  selector: 'pagination-info',
  template: `
      <small *ngIf="totalRows > 1; else elseOneResults">Se encontraron <strong>{{totalRows}}</strong> resultados.<br>
        Mostrando resultados del {{minIndex}} al {{maxIndex}}.</small>
      <ng-template #elseOneResults><small *ngIf="totalRows == 1; else elseNoResults">Se encontró un resultado.</small></ng-template>
      <ng-template #elseNoResults><small>No se encontraron resultados.</small></ng-template>
  `
})
export class PaginacionInfoComponent {

  minIndex: number;
  maxIndex: number;
  pages: number;
  private _totalRows: number;
  get totalRows(): number {
    return this._totalRows;
  }
  @Input('totalItems')
  set totalRows(totalRows: number) {
    this._totalRows = totalRows;
    this.setIndexes();
  }
  private _rows: number;
  get rows(): number {
    return this._rows;
  }
  @Input('itemsPerPage')
  set rows(rows: number) {
    this._rows = rows;
    this.setIndexes();
  }
  private _page: number;
  get page(): number {
    return this._page;
  }
  @Input('page')
  set page(page: number) {
    this._page = page;
    this.setIndexes();
  }

  constructor() {}

  setIndexes() {
    if (this._totalRows > 0) {
      this.pages = this._totalRows > 1 ? Math.ceil(this._totalRows / this._rows) : 1;
      this.minIndex = (this._rows > 1) ? (this._page - 1) * this._rows + 1 : 1;
      this.maxIndex = (this._page === this.pages) ? this._totalRows : this._rows * this._page;
    } else {
      this.pages = 0;
      this.minIndex = 0;
      this.maxIndex = 0;
    }
  }
}
