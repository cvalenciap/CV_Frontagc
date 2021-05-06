import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-return',
  template: 
  `<button class="btn btn-gray-dark container-button"
   (click)="OnRetornar()"> 
   <i class="fa fa-arrow-left"></i> Regresar</button>`
})
export class ButtonReturnComponent {

    constructor(private router: Router) { }
    
    
    OnRetornar(){
        this.router.navigate(['/inicio']);
    }

}