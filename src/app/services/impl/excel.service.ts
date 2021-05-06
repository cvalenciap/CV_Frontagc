import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Parametro } from '../../models/enums/parametro';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private datePipe: DatePipe) { }

  public exportarExcel(data: any, nombreArchivo: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

    this.guardarArchivoExcel(excelBuffer, nombreArchivo);
  }

  private guardarArchivoExcel(buffer: any, nombreArchivo: string): void {
    const data: Blob = new Blob([buffer], {type: Parametro.EXCEL_TYPE.toString()});
    FileSaver.saveAs(data, `${nombreArchivo}_log_${this.datePipe.transform(Date.now(), 'dd-MM-yyyy')}${Parametro.EXCEL_EXTENSION}`);
  }

  downloadFile(blob:Blob, name?:string){
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob,name || 'descarga');
      return;
    }
    const data = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = data;
    link.download = name;
    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }
}
