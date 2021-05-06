import {Component, OnInit} from '@angular/core';
import { detectBody } from '../../../app.helpers';
import {CargasTrabajoService} from '../../../services/impl/cargas-trabajo.service';

declare var jQuery:any;

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BasicLayoutComponent implements OnInit {


  constructor() {
  }

  public ngOnInit() {
    detectBody();
  }

  public onResize() {
    detectBody();
  }

}
