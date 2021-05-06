import { Component, OnInit, Input } from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'visor-pdf',
  templateUrl: 'visor-pdf.template.html'
})
export class VisorPdfComponent implements OnInit {

  @Input('url') url: string;
  fullUrl: string;

  @Input() download: boolean = false;

  constructor() {
  }
  ngOnInit() {

    if (this.url.includes('http://') || this.url.includes('blob:')) {
      this.fullUrl = this.url;
    } else {
      this.fullUrl = `${environment.fileServerServiceEndpoint}/${this.url}`;
    }
    console.log(this.fullUrl);
  }
}
