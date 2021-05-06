import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from 'src/app/models/numberOnly';

@NgModule({
    imports: [
        CommonModule        
     ],
    declarations: [        
        NumberOnlyDirective
    ],
    exports: [        
        NumberOnlyDirective
    ]
})
export class SharedModule {}