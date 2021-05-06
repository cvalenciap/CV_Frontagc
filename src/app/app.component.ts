import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppSettings } from './app.settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public constructor(private titleService: Title) {
    this.titleService.setTitle( AppSettings.APP_TITLE );
  }
}

