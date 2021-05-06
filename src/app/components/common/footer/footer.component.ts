import { Component } from '@angular/core';
import {AppSettings} from '../../../app.settings';

@Component({
  selector: 'footer',
  templateUrl: 'footer.template.html'
})
export class FooterComponent {

  id:string;
  copyright:string;
  version:string;

  constructor() {
    this.id = AppSettings.APP_ID;
    this.copyright = AppSettings.APP_COPYRIGHT;
    this.version = AppSettings.APP_VERSION;
  }
}
