import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-visor-pdf',
  templateUrl: './visor-pdf.component.html',
  styleUrls: ['./visor-pdf.component.scss']
})
export class VisorPdfComponent implements OnInit {
  public fullUrl: any;
  @Input('file') file: any;
  @Input('url') url: string;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.inicializar();
  }

  private inicializar() {
    if (this.url !== undefined && this.url !== null) {
      if (this.url.includes('http://')) {
        this.fullUrl = this.url;
      } else {
        this.fullUrl = `${environment.fileServerServiceEndpoint}/${this.url}`;

      }
    } else {
      this.fullUrl = this.file;
    }
  }

}
