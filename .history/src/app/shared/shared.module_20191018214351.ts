import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { StarsComponent } from '../components/stars/stars.component';



@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
    declarations: [ StarsComponent ],
    exports: [ StarsComponent ]
  })

  export class SharedModule {}
