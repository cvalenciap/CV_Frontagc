import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  exports: [
    MatTabsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatTooltipModule
  ]
})
export class MaterialModule { }
